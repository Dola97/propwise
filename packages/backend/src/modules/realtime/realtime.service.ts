import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import {
  CustomerEvent,
  CustomerEventPayload,
  BulkDeleteEventPayload,
} from './realtime.events';

@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  emitCustomerCreated(payload: CustomerEventPayload): void {
    this.gateway.server.emit(CustomerEvent.CREATED, payload);
  }

  emitCustomerUpdated(payload: CustomerEventPayload): void {
    this.gateway.server.emit(CustomerEvent.UPDATED, payload);
  }

  emitCustomerDeleted(id: string): void {
    this.gateway.server.emit(CustomerEvent.DELETED, { id });
  }

  emitBulkDeleted(ids: string[]): void {
    const payload: BulkDeleteEventPayload = { ids };
    this.gateway.server.emit(CustomerEvent.BULK_DELETED, payload);
  }
}
