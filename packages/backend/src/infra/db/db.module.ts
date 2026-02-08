import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import path from 'node:path';

const rootDir: string = process.cwd();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [path.join(rootDir, 'dist', '**', '*.entity.js')],
        migrations: [path.join(rootDir, 'dist', 'migrations', '*{.js}')],
        synchronize: false,
      }),
    }),
  ],
})
export class DbModule {}
