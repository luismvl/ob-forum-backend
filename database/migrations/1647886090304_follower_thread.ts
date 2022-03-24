import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FollowerThreads extends BaseSchema {
  protected tableName = 'follower_thread'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('thread_id').references('threads.id').notNullable().onDelete('CASCADE')
      table.integer('user_id').references('users.id').notNullable().onDelete('CASCADE')

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
