import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserCourses extends BaseSchema {
  protected tableName = 'user_courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE')
      table.integer('course_id').notNullable().references('courses.id').onDelete('CASCADE')
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
