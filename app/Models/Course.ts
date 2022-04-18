import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Module from './Module'
import User from './User'
import Subforum from './Subforum'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description?: string

  @column()
  public iconUrl?: string

  @hasMany(() => Module)
  public modules: HasMany<typeof Module>

  @hasMany(() => Subforum)
  public subforums: HasMany<typeof Subforum>

  @manyToMany(() => User, {
    pivotTable: 'follower_course',
  })
  public usersFollowing: ManyToMany<typeof User>

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
