exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_contents', function(table) {
    table.increments('cn_id').unsigned().primary();
    table.integer('cn_semester_id').references('sm_id').inTable('ed_semesters');
    table.integer('cn_subject_id').references('sb_id').inTable('ed_subjects');
    table.integer('cn_chapter_id').references('cp_id').inTable('ed_chapters');
    table.string('cn_name', 5000).notNullable();
    table.string('cn_description', 20000);
    table.string('cn_slug', 1000).unique().notNullable();
    table.integer('cn_type', [1, 2]).notNullable().defaultTo(1); // (theory -> 1) & (sum -> 2)
    table.integer('cn_difficulty_level', [1, 2, 3]).notNullable().defaultTo(1); // (easy -> 1) & (medium -> 2) & (hard -> 3)
    table.integer('cn_admin_id').references('a_id').inTable('ed_admins');
    table.boolean('cn_is_active').defaultTo(true);
    table.boolean('cn_is_deleted').defaultTo(false);
    table.timestamp('cn_created_at').defaultTo(knex.fn.now());
    table.timestamp('cn_updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_contents');
};
