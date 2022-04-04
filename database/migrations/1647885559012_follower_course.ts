import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FollowerCoures extends BaseSchema {
  protected tableName = 'follower_course'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('course_id').references('courses.id').notNullable().onDelete('CASCADE')
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
