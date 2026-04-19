import { Dialect, QueryInterface } from 'sequelize';
import sequelize from '../database';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // This tells Sequelize to look at all the loaded models in `database.ts`
    // and automatically generate and execute the SQL to create the tables.
    // We pass the existing transaction if there is one via queryInterface.
    await sequelize(process.env.DB_DIALECT as Dialect || 'postgres').sync();
  },

  async down(queryInterface: QueryInterface) {
    // This will drop all tables defined in the models
    await sequelize(process.env.DB_DIALECT as Dialect || 'postgres').drop();
  }
};
