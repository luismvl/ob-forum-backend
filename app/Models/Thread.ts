import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'
import Subforum from './Subforum'
import Vote from './Vote'

export default class Thread extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public subject: string

  @column()
  public content: string

  @column()
  public isPinned: boolean = false

  @column()
  public userId: number

  @column()
  public subforumId: number

  @computed()
  public get totalPosts() {
    return this.$extras.posts_count || undefined
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => Post)
  public pinnedPost: HasOne<typeof Post>

  @belongsTo(() => Subforum)
  public subforum: BelongsTo<typeof Subforum>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @manyToMany(() => User, {
    pivotTable: 'follower_thread',
  })
  public usersFollowing: ManyToMany<typeof User>

  @hasMany(() => Vote, { foreignKey: 'targetId', serializeAs: null })
  public votes: HasMany<typeof Vote>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static addCreatorFollow(thread: Thread) {
    thread.related('usersFollowing').attach([thread.userId])
  }
}
