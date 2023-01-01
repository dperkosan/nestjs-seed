import 'dotenv/config'; // try to find better way with ConfigModule
import { DataSource, DataSourceOptions } from 'typeorm';

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

type NodeEnvAllowedValues = 'development' | 'test' | 'production';

const config: Record<NodeEnvAllowedValues, DataSourceOptions> = {
  development: {
    ...defaultDataSourceOptions,
    logging: true,
  },
  test: {
    ...defaultDataSourceOptions,
    synchronize: true,
  },
  production: {
    ...defaultDataSourceOptions,
    synchronize: false, // Keep it for security. We do not want synchronize = true in production to prevent unwanted migrations.
    ssl: { rejectUnauthorized: false },
  },
};

export const dataSourceOptions: DataSourceOptions = {
  ...config[
    (process.env.NODE_ENV as NodeEnvAllowedValues | undefined) || 'development'
  ],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
