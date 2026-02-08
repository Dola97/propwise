import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { INTERNAL_HEADER } from '../constants';

interface InternalRequest extends Request {
  isInternal?: boolean;
}

@Injectable()
export class InternalAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<InternalRequest>();

    req.isInternal = req.headers[INTERNAL_HEADER] === 'true';

    return true;
  }
}
