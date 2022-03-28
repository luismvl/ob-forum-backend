import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Votes extends BaseSchema {
  protected tableName = 'votes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('type').notNullable()
      table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE')
      table.integer('target_id').notNullable() // post_id or thread_id
      table.integer('target_type').notNullable() // 1 for post, 2 for thread
      table.primary(['user_id', 'target_id', 'target_type'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
