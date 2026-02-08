import { Customer } from '../entities/customer.entity';
import {
  CustomerInternalDto,
  CustomerPublicDto,
} from './customer-response.dto';

export function toCustomerDto(
  entity: Customer,
  isInternal: boolean,
): CustomerPublicDto | CustomerInternalDto {
  if (isInternal) {
    const dto = new CustomerInternalDto();
    dto.id = entity.id;
    dto.full_name = entity.full_name;
    dto.email = entity.email;
    dto.phone_number = entity.phone_number;
    dto.national_id = entity.national_id;
    dto.internal_notes = entity.internal_notes;
    dto.created_at = entity.created_at;
    dto.updated_at = entity.updated_at;
    return dto;
  }

  const dto = new CustomerPublicDto();
  dto.id = entity.id;
  dto.full_name = entity.full_name;
  dto.email = entity.email;
  dto.phone_number = entity.phone_number;
  dto.created_at = entity.created_at;
  dto.updated_at = entity.updated_at;
  return dto;
}

export function toCustomerDtoList(
  entities: Customer[],
  isInternal: boolean,
): (CustomerPublicDto | CustomerInternalDto)[] {
  return entities.map((entity) => toCustomerDto(entity, isInternal));
}
