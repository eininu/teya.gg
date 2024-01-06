import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

const configs: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'test',
  password: process.env.DB_PASSWORD || 'test',
  database: process.env.POSTGRES_DB || 'test',
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
