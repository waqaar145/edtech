exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_comment_likes', function(table) {
    table.increments('id').unsigned().primary();
    table.integer('comment_id').references('comm_id').inTable('ed_comments');
    table.integer('user_id').references('u_id').inTable('ed_users');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_comment_likes');
};
