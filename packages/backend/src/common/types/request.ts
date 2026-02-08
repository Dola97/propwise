import { Request } from 'express';

export interface InternalRequest extends Request {
  isInternal: boolean;
}
