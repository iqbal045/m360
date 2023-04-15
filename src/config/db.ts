import { Knex } from 'knex';
import knexConfig from '../../knexfile';

const knex: Knex = require('knex')(knexConfig);

const dbConnect: () => Knex = () => knex;

export default dbConnect;
