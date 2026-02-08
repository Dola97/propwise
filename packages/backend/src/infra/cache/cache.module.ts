import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');
        if (!redisUrl) throw new Error('REDIS_URL is required');

        return {
          ttl: 60_000, // Default TTL: 60 seconds (in ms for cache-manager v5+)
          stores: [new KeyvRedis(redisUrl)],
        };
      },
    }),
  ],
})
export class AppCacheModule {}
