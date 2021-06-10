exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_blogs_likes', function(table) {
    table.increments('id').unsigned().primary();
    table.integer('blog_id').references('b_id').inTable('ed_blogs');
    table.integer('user_id').references('u_id').inTable('ed_users');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_blogs_likes');
};
