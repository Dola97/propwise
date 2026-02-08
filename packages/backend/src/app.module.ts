import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { DbModule } from './infra/db/db.module';
import { AppCacheModule } from './infra/cache/cache.module';
import { CustomerCacheService } from './infra/cache/customer-cache.service';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    DbModule,
    AppCacheModule,
    RealtimeModule,
    CustomersModule,
  ],
  providers: [CustomerCacheService],
  exports: [CustomerCacheService],
})
export class AppModule {}
