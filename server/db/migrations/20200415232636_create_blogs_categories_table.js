exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_blogs_categories', function(table) {
    table.increments('b_c_id').unsigned().primary();
    table.integer('b_c_blog_id').references('b_id').inTable('ed_blogs');
    table.integer('b_c_category_id').references('c_id').inTable('ed_blog_categories');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_blogs_categories');
};
