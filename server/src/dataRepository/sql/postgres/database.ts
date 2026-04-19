import { Sequelize } from 'sequelize-typescript';
import * as models from './models';

const modelClasses = Object.values(models).filter((model) => typeof model === 'function');

// This instance can be used by the application and the migration script
export default new Sequelize({
  database: process.env.DB_NAME || 'bloodconnect',
  dialect: 'postgres',
  username: process.env.DB_USER || 'bloodconnect',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  models: modelClasses,
  logging: false,
});
