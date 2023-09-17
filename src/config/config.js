const fs = require('fs');

module.exports = {
  develop: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: 'postgres',
    password: '123root',
    database: 'blogdb',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: 'postgres',
    password: '123root',
    database: 'blogdb',
    host: 'localhost',
    dialect: 'postgres',
  },
};
