exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_universities', function(table) {
    table.increments('university_id').unsigned().primary();
    table.string('university_name', 200).unique().notNullable();
    table.string('university_short_name', 200).unique().notNullable();
    table.string('university_slug', 500).unique().notNullable();
    table.string('university_thumbnail', 500);
    table.integer('university_admin_id').references('a_id').inTable('ed_admins');
    table.boolean('university_is_active').defaultTo(true);
    table.boolean('university_is_deleted').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_universities');
};
