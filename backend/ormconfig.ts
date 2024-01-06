import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

const configs: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'db',
  port: Number(process.env.DATABASE_PORT) || 5435,
  username: process.env.DATABASE_USERNAME || 'test',
  password: process.env.DATABASE_PASSWORD || 'test',
  database: process.env.DATABASE_NAME || 'test',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  synchronize: false,
};

export default new DataSource(configs);

// import { DataSource, DataSourceOptions } from "typeorm";
// export const dataSourceOptions: DataSourceOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'postgres',
//   database: 'avl',
//   migrations: ["dist/migrations/*.js"],
// }
// const dataSource = new DataSource(dataSourceOptions)
// export default dataSource
