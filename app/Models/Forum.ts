import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Subforum from './Subforum'
import User from './User'

export default class Forum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => Subforum)
  public subforums: HasMany<typeof Subforum>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'follower_forums',
  })
  public usersFollowing: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
