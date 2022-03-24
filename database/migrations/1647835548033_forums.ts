import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Forums extends BaseSchema {
  protected tableName = 'forums'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('course_id').nullable().references('courses.id').onDelete('SET NULL')
      table.string('title', 255).notNullable()

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
