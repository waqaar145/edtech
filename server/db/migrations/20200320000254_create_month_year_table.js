exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_years', function(table) {
    table.increments('y_id').unsigned().primary();
    table.string('y_month').notNullable();
    table.integer('y_year').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_years');
};
