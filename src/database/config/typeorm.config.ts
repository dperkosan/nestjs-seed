import 'dotenv/config'; // try to find better way with ConfigModule. This is because of the migration script where I don't have ENV variables.
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const defaultDataSourceOptions: DataSourceOptions = {
  type: 'postgres', // type of the database
  host: process.env.DB_HOST, // database host
  database: process.env.DB_NAME, // database name
  port: parseInt(process.env.DB_PORT), // database port
  username: process.env.DB_USERNAME, // username
  password: process.env.DB_PASSWORD, // user password
  synchronize: false, // force migration with this set to FALSE
  logging: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

export const nodeEnvAllowedValues = [
  'development',
  'test',
  'production',
] as const;
type NodeEnvAllowedValues = typeof nodeEnvAllowedValues[number];

const config: Record<NodeEnvAllowedValues, DataSourceOptions> = {
  development: {
    ...defaultDataSourceOptions,
    logging: true,
  },
  test: {
    ...defaultDataSourceOptions,
    database: process.env.DB_NAME_TEST, // test database name
    synchronize: true,
  },
  production: {
    ...defaultDataSourceOptions,
    synchronize: false, // Keep it for security. We do not want synchronize = true in production to prevent unwanted migrations.
    ssl: { rejectUnauthorized: false },
  },
};

const dataSourceOptions: DataSourceOptions = {
  ...config[
    (process.env.NODE_ENV as NodeEnvAllowedValues | undefined) || 'development'
  ],
};

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...dataSourceOptions,
  autoLoadEntities: true, // every entity registered through the forFeature() method will be automatically added to the entities array
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
