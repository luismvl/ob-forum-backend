import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Subforum from './Subforum'
import User from './User'
import Course from './Course'

export default class Forum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public courseId: number

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @hasMany(() => Subforum)
  public subforums: HasMany<typeof Subforum>

  @manyToMany(() => User, {
    pivotTable: 'follower_forum',
  })
  public usersFollowing: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
