import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import * as models from './models';

const modelClasses = Object.values(models);

// This instance can be used by the application and the migration script
export default (dialect: Dialect = 'postgres') => new Sequelize({
  database: process.env.DB_NAME || 'bloodconnect',
  dialect,
  username: process.env.DB_USER || 'bloodconnect',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  models: modelClasses,
  logging: false,
});
