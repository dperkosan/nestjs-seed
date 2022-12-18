import { DataSourceOptions } from 'typeorm';

const defaultConfig: DataSourceOptions = {
  type: 'postgres', // type of the database
  host: 'localhost', // database host
  port: 5432, // database port
  username: 'postgres', // username
  password: 'postgres', // user password
  synchronize: false, // force migration with this set to FALSE
  logging: false,
};

type NodeEnvAllowedValues = 'development' | 'test' | 'production';

const config: Record<NodeEnvAllowedValues, DataSourceOptions> = {
  development: {
    ...defaultConfig,
    database: 'nestjs-seed-dev',
    logging: true,
  },
  test: {
    ...defaultConfig,
    database: 'nestjs-seed-test',
    synchronize: true,
  },
  production: {
    ...defaultConfig,
    synchronize: false, // Keep it for security. We do not want synchronize = true in production to prevent unwanted migrations.
    ssl: { rejectUnauthorized: false },
  },
};

const connectionOptions: DataSourceOptions = {
  ...config[
    (process.env.NODE_ENV as NodeEnvAllowedValues | undefined) || 'development'
  ],
};

export default connectionOptions;
