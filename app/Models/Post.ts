import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Thread from './Thread'
import Vote from './Vote'
import { VoteTargetType } from 'Contracts/enums/VoteTargetType'

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
}
