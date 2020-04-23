exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_blog_categories', function(table) {
    table.increments('c_id').unsigned().primary();
    table.string('c_name', 200).notNullable();
    table.string('c_slug', 200).unique().notNullable();
    table.string('c_thumbnail', 500);
    table.integer('c_admin_id').references('a_id').inTable('ed_admins');
    table.boolean('c_is_active').defaultTo(true);
    table.boolean('c_is_deleted').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_blog_categories');
};
