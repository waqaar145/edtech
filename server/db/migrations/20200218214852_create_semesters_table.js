exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_semesters', function(table) {
    table.increments('sm_id').unsigned().primary();
    table.integer('sm_university_id').references('university_id').inTable('ed_universities');
    table.string('sm_name', 200).notNullable();
    table.string('sm_slug', 200).unique().notNullable();
    table.string('sm_thumbnail', 500);
    table.integer('sm_admin_id').references('a_id').inTable('ed_admins');
    table.boolean('sm_is_active').defaultTo(true);
    table.boolean('sm_is_deleted').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_semesters');
};
