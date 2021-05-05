exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_subjects', function(table) {
    table.increments('sb_id').unsigned().primary();
    table.integer('sb_semester_id').references('sm_id').inTable('ed_semesters');
    table.integer('sb_branch_id');
    table.string('sb_name', 200).notNullable();
    table.string('sb_description', 600);
    table.string('sb_slug', 200).unique().notNullable();
    table.string('sb_thumbnail', 500);
    table.integer('sb_admin_id').references('a_id').inTable('ed_admins');
    table.boolean('sb_is_active').defaultTo(true);
    table.boolean('sb_is_deleted').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_subjects');
};
