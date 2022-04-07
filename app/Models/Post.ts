import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Thread from './Thread'
import Vote from './Vote'
import { VoteTargetType } from 'Contracts/enums/VoteTargetType'
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

  // @computed()
  // public get votesCount(): number {
  //   return this.$extras.votes_count || undefined
  // }

  @computed()
  public get votesScore(): number {
    return this.$extras.votes_score || undefined
  }

  @computed()
  public get upVotesCount(): number {
    return this.$extras.up_votes_count || undefined
  }

  @computed()
  public get donwVotesCount(): number {
    return this.$extras.down_votes_count || undefined
  }

  @hasMany(() => Vote, {
    foreignKey: 'targetId',
    onQuery(query) {
      query.where('target_type', VoteTargetType.POST)
    },
  })
  public votes: HasMany<typeof Vote>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Thread)
  public thread: BelongsTo<typeof Thread>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static withUpVotes = scope((query: ModelQueryBuilderContract<typeof Post>) => {
    query.withCount('votes', (query) => query.where('type', VoteType.UP_VOTE).as('up_votes_count'))
  })

  public static withDownVotes = scope((query: ModelQueryBuilderContract<typeof Post>) => {
    query.withCount('votes', (query) =>
      query.where('type', VoteType.DOWN_VOTE).as('down_votes_count')
    )
  })

  public static orderByTotalUpVotes = scope(
    (query: ModelQueryBuilderContract<typeof Post>, order?: 'desc' | 'asc') => {
      query.match(
        [
          order === 'desc',
          (query) => {
            query.orderBy('up_votes_count', order).orderBy('down_votes_count', 'asc')
          },
        ],
        [
          order === 'asc',
          (query) => query.orderBy('up_votes_count', order).orderBy('down_votes_count', 'desc'),
        ],
        (query) => query.orderBy('up_votes_count', 'desc').orderBy('down_votes_count', 'asc')
      )
    }
  )

  public static orderByUpdated = scope(
    (query: ModelQueryBuilderContract<typeof Post>, order?: 'desc' | 'asc') => {
      query.orderBy('updated_at', order ?? 'desc')
    }
  )
}
