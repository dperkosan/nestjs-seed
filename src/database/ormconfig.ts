import { DataSourceOptions } from 'typeorm';

const defaultConfig: DataSourceOptions = {
  type: 'postgres', // type of the database
  host: 'postgres', // database host (service name in docker-compose.yml file)
  port: 5432, // database port
  username: 'postgres', // username
  password: 'postgres', // user password
  synchronize: false, // force migration with this set to FALSE
};

type NodeEnvAllowedValues = 'development' | 'test' | 'production';

const config: Record<NodeEnvAllowedValues, DataSourceOptions> = {
  development: {
    ...defaultConfig,
    database: 'naya-api-dev', // name of the database,
    synchronize: false,
    logging: true,
  },
  test: {
    ...defaultConfig,
    database: 'naya-api-test', // name of the database,
    synchronize: true,
  },
  production: {
    ...defaultConfig,
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  },
};

const connectionOptions: DataSourceOptions = {
  ...config[
    (process.env.NODE_ENV as NodeEnvAllowedValues | undefined) || 'development'
  ],
};

export default connectionOptions;
