import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Customer } from './entities/customer.entity';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  QueryCustomersDto,
  toCustomerDto,
  toCustomerDtoList,
  CustomerPublicDto,
  CustomerInternalDto,
} from './dto';
import { CustomerCacheService } from '../../infra/cache/customer-cache.service';
import { sanitizeForPublicWrite } from '../../common/utils/sanitize';
import { PaginatedResponse } from '../../common/types/paginated';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
    private readonly cacheService: CustomerCacheService,
    private readonly realtimeService: RealtimeService,
  ) {}

  // --- CREATE ---

  async create(
    dto: CreateCustomerDto,
    isInternal: boolean,
  ): Promise<CustomerPublicDto | CustomerInternalDto> {
    // Check email uniqueness
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Strip sensitive fields if not internal
    const payload = isInternal ? dto : sanitizeForPublicWrite(dto);

    const customer = this.repo.create(payload);
    const saved = await this.repo.save(customer);

    // Invalidate list caches (new customer affects all lists)
    await this.cacheService.invalidateForMutation();

    // Emit created event
    this.realtimeService.emitCustomerCreated({
      id: saved.id,
      full_name: saved.full_name,
      email: saved.email,
    });

    return toCustomerDto(saved, isInternal);
  }

  // --- FIND ALL (paginated + search + filter + sort) ---

  async findAll(
    query: QueryCustomersDto,
    isInternal: boolean,
  ): Promise<PaginatedResponse<CustomerPublicDto | CustomerInternalDto>> {
    // Check cache first
    const cacheParams = { ...query };
    const cached = await this.cacheService.getList<
      PaginatedResponse<CustomerPublicDto | CustomerInternalDto>
    >(cacheParams, isInternal);

    if (cached) {
      return cached;
    }

    const qb: SelectQueryBuilder<Customer> = this.repo
      .createQueryBuilder('customer')
      .where('customer.deleted_at IS NULL');

    if (query.q) {
      qb.andWhere('(customer.full_name ILIKE :q OR customer.email ILIKE :q)', {
        q: `%${query.q}%`,
      });
    }

    // Date range filtering
    if (query.createdAfter) {
      qb.andWhere('customer.created_at >= :after', {
        after: query.createdAfter,
      });
    }
    if (query.createdBefore) {
      qb.andWhere('customer.created_at <= :before', {
        before: query.createdBefore,
      });
    }

    // Sorting
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder || 'DESC';
    qb.orderBy(`customer.${sortBy}`, sortOrder);

    // Pagination — OFFSET used for simplicity.
    // For deep pages (>10k offset), cursor-based pagination
    // with WHERE id > :lastId would avoid the linear scan cost.
    const page = query.page || 1;
    const limit = query.limit || 10;
    qb.skip((page - 1) * limit).take(limit);

    const [customers, total] = await qb.getManyAndCount();

    const result: PaginatedResponse<CustomerPublicDto | CustomerInternalDto> = {
      data: toCustomerDtoList(customers, isInternal),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };

    // Cache the result
    await this.cacheService.setList(cacheParams, isInternal, result);

    return result;
  }

  // --- FIND ONE ---

  async findOne(
    id: string,
    isInternal: boolean,
  ): Promise<CustomerPublicDto | CustomerInternalDto> {
    // Check cache
    const cached = await this.cacheService.getDetail<
      CustomerPublicDto | CustomerInternalDto
    >(id, isInternal);
    if (cached) return cached;

    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const dto = toCustomerDto(customer, isInternal);

    // Cache the result
    await this.cacheService.setDetail(id, isInternal, dto);

    return dto;
  }

  // --- UPDATE ---

  async update(
    id: string,
    dto: UpdateCustomerDto,
    isInternal: boolean,
  ): Promise<CustomerPublicDto | CustomerInternalDto> {
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check email uniqueness if email is being updated
    if (dto.email && dto.email !== customer.email) {
      const existing = await this.repo.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    // Strip sensitive fields if not internal
    const payload = isInternal ? dto : sanitizeForPublicWrite(dto);

    Object.assign(customer, payload);
    const saved = await this.repo.save(customer);

    // Invalidate caches
    await this.cacheService.invalidateForMutation([id]);

    this.realtimeService.emitCustomerUpdated({
      id: saved.id,
      full_name: saved.full_name,
      email: saved.email,
    });

    return toCustomerDto(saved, isInternal);
  }

  // --- DELETE ---

  async remove(id: string): Promise<void> {
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.repo.softRemove(customer);

    // Invalidate caches
    await this.cacheService.invalidateForMutation([id]);

    this.realtimeService.emitCustomerDeleted(id);
  }

  // --- BULK DELETE ---

  async bulkRemove(ids: string[]): Promise<void> {
    const customers = await this.repo.find({ where: { id: In(ids) } });

    if (customers.length === 0) {
      throw new NotFoundException('No customers found for given IDs');
    }

    // Check for missing IDs
    const foundIds = new Set(customers.map((c) => c.id));
    const missingIds = ids.filter((id) => !foundIds.has(id));

    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Customers not found: ${missingIds.join(', ')}`,
      );
    }

    await this.repo.softRemove(customers);
    this.realtimeService.emitBulkDeleted(ids);
    await this.cacheService.invalidateForMutation(ids);
  }

  // --- Helper: get entity for socket payloads ---

  async getEntityById(id: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { id } });
  }
}
