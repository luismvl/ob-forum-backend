import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Thread from './Thread'
import Vote from './Vote'
import { VoteType } from 'Contracts/enums/VoteType'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public content: string

  @column()
  public isPinned: boolean

  @column()
  public userId: number

  @column()
  public threadId: number

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

  @hasMany(() => Vote, { foreignKey: 'targetId', serializeAs: null })
  public votes: HasMany<typeof Vote>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Thread)
  public thread: BelongsTo<typeof Thread>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeFetch()
  public static preloadVotesOnFetch(query: ModelQueryBuilderContract<typeof Thread>) {
    query.preload('votes')
  }

  @beforeFind()
  public static preloadVotesOnFind(query: ModelQueryBuilderContract<typeof Thread>) {
    query.preload('votes')
  }
}
