import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
  ManyToMany,
  manyToMany,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import Subforum from './Subforum'
import User from './User'
import Course from './Course'
import Thread from './Thread'
import Module from './Module'

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

  @hasManyThrough([() => Thread, () => Subforum])
  public threads: HasManyThrough<typeof Thread>

  @hasManyThrough([() => Module, () => Subforum])
  public modules: HasManyThrough<typeof Module>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static withUser = scope(async (query, user: User) => {
    const userCourses = await user.related('courses').query().select('id')
    return query.whereIn(
      'course_id',
      userCourses.map((course) => course.id)
    )
  })
}
