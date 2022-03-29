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
import Forum from './Forum'
import User from './User'
import Module from './Module'

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
  public forumId: number

  @computed()
  public get totalThreads() {
    return this.$preloaded.threads ? this.threads.length : undefined
  }

  @belongsTo(() => Module)
  public module: BelongsTo<typeof Module>

  @hasMany(() => Thread)
  public threads: HasMany<typeof Thread>

  @belongsTo(() => Forum)
  public forum: BelongsTo<typeof Forum>

  @manyToMany(() => User, {
    pivotTable: 'follower_subforum',
  })
  public usersFollowing: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
