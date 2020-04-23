exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_chapters', function(table) {
    table.increments('cp_id').unsigned().primary();
    table.integer('cp_semester_id').references('sm_id').inTable('ed_semesters');
    table.integer('cp_subject_id').references('sb_id').inTable('ed_subjects');
    table.string('cp_name', 200).notNullable();
    table.integer('cp_number').notNullable();
    table.string('cp_slug').notNullable();
    table.string('cp_description', 600);
    table.integer('cp_admin_id').references('a_id').inTable('ed_admins');
    table.boolean('cp_is_active').defaultTo(true);
    table.boolean('cp_is_deleted').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_chapters');
};
