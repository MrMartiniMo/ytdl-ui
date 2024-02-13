/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.renameColumn('text', 'url')
    table.string('params')
    table.bigint('userId').references('id').inTable('users').onDelete('CASCADE')
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.renameColumn('url', 'text')
    table.dropColumn('params')
    table.dropColumn('userId')
    table.dropColumn('createdAt')
  })
}
