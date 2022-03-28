import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeFetch,
  beforeFind,
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
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'
import Subforum from './Subforum'
import Vote from './Vote'
import { VoteType } from 'Contracts/enums/VoteType'

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
  public get votesCount(): number {
    return this.votes.length
  }

  @computed()
  public get upVotesCount(): number {
    return this.votes.filter((vote) => vote.type === VoteType.UP_VOTE).length
  }

  @computed()
  public get donwVotesCount(): number {
    return this.votes.filter((vote) => vote.type === VoteType.DOWN_VOTE).length
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
  public static addFollow(thread: Thread) {
    thread.related('usersFollowing').attach([thread.userId])
  }

  @beforeFetch()
  public static preloadVotesOnFetch(query: ModelQueryBuilderContract<typeof Thread>) {
    query.preload('votes')
  }

  @beforeFind()
  public static preloadVotesOnFind(query: ModelQueryBuilderContract<typeof Thread>) {
    query.preload('votes')
  }

  @beforeFetch()
  public static preloadPostsOnFetch(query: ModelQueryBuilderContract<typeof Thread>) {
    query.preload('posts')
  }

  @beforeFind()
  public static preloadPostsOnFind(query: ModelQueryBuilderContract<typeof Thread>) {
    query.preload('posts')
  }
}
