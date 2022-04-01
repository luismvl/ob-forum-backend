import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Thread from './Thread'
import User from './User'
import Module from './Module'
import Course from './Course'

export default class Subforum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public isPinned: boolean

  @column()
  public moduleId?: number

  @column()
  public courseId: number

  @computed()
  public get totalThreads() {
    return this.$preloaded.threads ? this.threads.length : undefined
  }

  @belongsTo(() => Module)
  public module: BelongsTo<typeof Module>

  @hasMany(() => Thread)
  public threads: HasMany<typeof Thread>

  @belongsTo(() => Course)
  public forum: BelongsTo<typeof Course>

  @manyToMany(() => User, {
    pivotTable: 'follower_subforum',
  })
  public usersFollowing: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
