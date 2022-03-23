import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Thread from './Thread'
import Forum from './Forum'
import User from './User'

export default class Subforum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public forumId: number

  @hasMany(() => Thread)
  public threads: HasMany<typeof Thread>

  @belongsTo(() => Forum)
  public forum: BelongsTo<typeof Forum>

  @manyToMany(() => User, {
    pivotTable: 'follower_subforums',
  })
  public usersFollowing: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
