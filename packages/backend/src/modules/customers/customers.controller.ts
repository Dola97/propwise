import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  QueryCustomersDto,
  BulkDeleteDto,
} from './dto';
import type { InternalRequest } from '../../common/types/request';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto, @Req() req: InternalRequest) {
    return this.customersService.create(dto, req.isInternal);
  }

  @Get()
  findAll(@Query() query: QueryCustomersDto, @Req() req: InternalRequest) {
    return this.customersService.findAll(query, req.isInternal);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: InternalRequest) {
    return this.customersService.findOne(id, req.isInternal);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
    @Req() req: InternalRequest,
  ) {
    return this.customersService.update(id, dto, req.isInternal);
  }

  @Delete('bulk')
  bulkRemove(@Body() dto: BulkDeleteDto) {
    return this.customersService.bulkRemove(dto.ids);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
