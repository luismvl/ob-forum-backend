import { DateTime } from 'luxon'
import {
  afterCreate,
  afterSave,
  BaseModel,
  beforeFind,
  beforeSave,
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
  ModelQueryBuilderContract,
  PreloaderContract,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'
import Subforum from './Subforum'

export default class Thread extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public subforumId: number

  @column()
  public subject: string

  @column()
  public isPinned: boolean = false

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  // @computed()
  // public get originalPost() {
  //   console.log('calculating op post')
  //   if (!this.posts) return null
  //   // console.log({ posts: this.posts })
  //   return this.posts?.reduce((op, p) => (p.createdAt < op.createdAt ? p : op), this.posts[0])
  // }

  // @beforeFind()
  // public static preloadPosts(query: ModelQueryBuilderContract<typeof User>) {
  //   console.log('trying to preload posts')
  //   query.preload('posts')
  // }

  @hasOne(() => Post)
  public pinnedPost: HasOne<typeof Post>

  @belongsTo(() => Subforum)
  public subforum: BelongsTo<typeof Subforum>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @manyToMany(() => User, {
    pivotTable: 'follower_threads',
  })
  public usersFollowing: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterSave()
  public static addFollow(thread: Thread) {
    thread.related('usersFollowing').attach([thread.userId])
  }
}
