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
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'
import Subforum from './Subforum'
import Vote from './Vote'
import { VoteTarget } from 'Contracts/enums/VoteTarget'
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
    return this.$extras.votes_count || undefined
  }

  @computed()
  public get upVotesCount(): number {
    return this.$extras.up_votes_count || undefined
  }

  @computed()
  public get donwVotesCount(): number {
    return this.$extras.down_votes_count || undefined
  }

  @computed()
  public get totalPosts() {
    return this.$extras.posts_count || undefined
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Subforum)
  public subforum: BelongsTo<typeof Subforum>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @manyToMany(() => User, {
    pivotTable: 'follower_thread',
  })
  public usersFollowing: ManyToMany<typeof User>

  @hasMany(() => Vote, {
    foreignKey: 'targetId',
    onQuery(query) {
      query.where('target_type', VoteTarget.THREAD)
    },
  })
  public votes: HasMany<typeof Vote>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static addCreatorFollow(thread: Thread) {
    thread.related('usersFollowing').attach([thread.userId])
  }
  public static withUpVotes = scope((query: ModelQueryBuilderContract<typeof Thread>) => {
    query.withCount('votes', (query) => query.where('type', VoteType.UP_VOTE).as('up_votes_count'))
  })

  public static withDownVotes = scope((query: ModelQueryBuilderContract<typeof Thread>) => {
    query.withCount('votes', (query) =>
      query.where('type', VoteType.DOWN_VOTE).as('down_votes_count')
    )
  })
}
