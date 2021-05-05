exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_branchs', function(table) {
    table.increments('branch_id').unsigned().primary();
    table.integer('branch_university_id').references('university_id').inTable('ed_universities');
    table.string('branch_name', 200).unique().notNullable();
    table.string('branch_short_name', 200).unique().notNullable();
    table.string('branch_slug', 500).unique().notNullable();
    table.string('branch_thumbnail', 500);
    table.integer('branch_admin_id').references('a_id').inTable('ed_admins');
    table.boolean('branch_is_active').defaultTo(true);
    table.boolean('branch_is_deleted').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_branchs');
};
