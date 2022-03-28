import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'
import { VoteType } from 'Contracts/enums/VoteType'
import { VoteTargetType } from 'Contracts/enums/VoteTargetType'
import Thread from './Thread'

export default class Vote extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: VoteType

  @column()
  public userId: number

  @column()
  public targetId: number

  @column()
  public targetType: VoteTargetType

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>

  @belongsTo(() => Thread)
  public thread: BelongsTo<typeof Thread>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Valida el targetId
  @beforeCreate()
  public static async validateTargetId(vote: Vote) {
    if (vote.targetType === VoteTargetType.POST) {
      await Post.findOrFail(vote.targetId)
    } else {
      await Thread.findOrFail(vote.targetId)
    }
  }
}
