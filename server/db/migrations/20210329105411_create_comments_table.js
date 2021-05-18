exports.up = function(knex, Promise) {
  return knex.schema.createTable('ed_comments', function(table) {
    table.increments('comm_id').unsigned().primary();
    table.integer('comm_content_id').references('cn_id').inTable('ed_contents');
    table.integer('comm_user_id').references('u_id').inTable('ed_users');
    table.integer('comm_parent_id').references('comm_id').inTable('ed_comments');
    table.string('comm_comment', 5000).notNullable();
    table.integer('comm_total_likes').defaultTo(0);
    table.integer('comm_total_dislikes').defaultTo(0);
    table.integer('comm_total_replies').defaultTo(0);
    table.boolean('comm_is_active').defaultTo(true);
    table.boolean('comm_is_deleted').defaultTo(false);
    table.timestamp('comm_created_at').defaultTo(knex.fn.now());
    table.timestamp('comm_updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ed_comments');
};
