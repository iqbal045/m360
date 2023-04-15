import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table
      .integer('parent_id')
      .unsigned()
      .references('id')
      .inTable('categories');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('attributes', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('attribute_values', table => {
    table.increments('id').primary();
    table
      .integer('attribute_id')
      .unsigned()
      .references('id')
      .inTable('attributes');
    table.string('value').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('products', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.json('cat_id').notNullable();
    table.json('attribute_id').notNullable();
    table.float('price', 10, 2).notNullable();
    table.text('description').notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('attribute_values');
  await knex.schema.dropTableIfExists('attributes');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('categories');
}
