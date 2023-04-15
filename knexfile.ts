import dotenv from 'dotenv';
import path from 'path';
import { Knex } from 'knex';

dotenv.config();

const config: Knex.Config = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: path.join(__dirname, 'src/database/migrations'),
  },
  seeds: {
    directory: path.join(__dirname, 'src/database/seeds'),
  },
};

export = config;
