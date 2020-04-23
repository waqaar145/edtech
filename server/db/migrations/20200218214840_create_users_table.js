exports.up = function(knex, Promise) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(function () {
      return knex.schema.createTable('ed_users', function(table) {
        table.increments('u_id').unsigned().primary();
        table.uuid('u_uuid').unique().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('u_first_name').notNullable();
        table.string('u_last_name').notNullable();
        table.string('u_username').unique().notNullable();
        table.string('u_email').unique().notNullable();
        table.string('u_password').notNullable();
        table.integer('u_social_source').defaultTo(0);
        table.boolean('su_is_active').defaultTo(true);
        table.boolean('su_is_deleted').defaultTo(false);
        table.timestamp('u_created_at').defaultTo(knex.fn.now());
        table.timestamp('u_updated_at').defaultTo(knex.fn.now());
      });
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_users');
};
