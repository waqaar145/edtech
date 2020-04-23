exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_content_years', function(table) {
    table.increments('cy_id').unsigned().primary();
    table.integer('cy_content_id').references('cn_id').inTable('ed_contents');
    table.integer('cy_year_id').references('y_id').inTable('ed_years');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_content_years');
};
