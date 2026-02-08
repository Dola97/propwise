import path from 'node:path';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const rootDir: string = process.cwd();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [path.join(rootDir, 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(rootDir, 'migrations', '*{.ts,.js}')],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
