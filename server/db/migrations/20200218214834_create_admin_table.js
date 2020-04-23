exports.up = function(knex, Promise) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(function () {
      return knex.schema.createTable('ed_admins', function(table) {
        table.increments('a_id').unsigned().primary();
        table.uuid('a_uuid').unique().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('a_name').notNullable();
        table.string('a_slug').unique().notNullable();
        table.string('a_email').unique().notNullable();
        table.string('a_password').notNullable();
        table.boolean('a_is_active').defaultTo(true);
        table.boolean('a_is_deleted').defaultTo(false);
        table.timestamp('a_created_at').defaultTo(knex.fn.now());
        table.timestamp('a_updated_at').defaultTo(knex.fn.now());
      });
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_admins');
};
