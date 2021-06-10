exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_content_likes', function(table) {
    table.increments('id').unsigned().primary();
    table.integer('content_id').references('cn_id').inTable('ed_contents');
    table.integer('user_id').references('u_id').inTable('ed_users');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_content_likes');
};
