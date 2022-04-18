import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subforums extends BaseSchema {
  protected tableName = 'subforums'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('description', 255).notNullable()
      table.boolean('is_pinned').notNullable().defaultTo(false)
      table.integer('course_id').notNullable().references('courses.id').onDelete('CASCADE')
      table.integer('module_id').nullable().references('modules.id').onDelete('SET NULL')
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
