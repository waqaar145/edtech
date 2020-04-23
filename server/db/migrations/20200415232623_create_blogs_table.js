exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_blogs', function(table) {
    table.increments('b_id').unsigned().primary();
    table.string('b_title', 5000).notNullable();
    table.string('b_slug', 1000).unique().notNullable();
    table.string('b_description', 20000);
    table.integer('b_admin_id').references('a_id').inTable('ed_admins');
    table.boolean('b_is_active').defaultTo(true);
    table.boolean('b_is_deleted').defaultTo(false);
    table.timestamp('b_created_at').defaultTo(knex.fn.now());
    table.timestamp('b_updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_blogs');
};
