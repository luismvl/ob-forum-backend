import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  computed,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'
import { VoteType } from 'Contracts/enums/VoteType'
import { VoteTarget } from 'Contracts/enums/VoteTarget'
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
  public targetType: VoteTarget

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  // TODO: Buscar una manera de crear una variable que sea Post o Thread segun el targetType
  @belongsTo(() => Post, {
    foreignKey: 'targetId',
    serializeAs: null,
  })
  public post: BelongsTo<typeof Post>

  @belongsTo(() => Thread, {
    foreignKey: 'targetId',
    serializeAs: null,
  })
  public thread: BelongsTo<typeof Thread>

  @computed()
  public get target(): Post | Thread {
    return this.targetType === VoteTarget.POST ? this.post : this.thread
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Valida el targetId
  @beforeCreate()
  public static async validateTargetId(vote: Vote) {
    if (vote.targetType === VoteTarget.POST) {
      await Post.findOrFail(vote.targetId)
    } else {
      await Thread.findOrFail(vote.targetId)
    }
  }

  public static withTarget = scope((query: ModelQueryBuilderContract<typeof Vote>) => {
    query.preload('post')
    query.preload('thread')
  })
}
