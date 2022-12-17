import { DataSource } from 'typeorm';
import dbconfig from './db.config';

export default new DataSource({
  ...dbconfig,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});
