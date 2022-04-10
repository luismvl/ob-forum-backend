import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vote from 'App/Models/Vote'
import { VoteTargetType } from 'Contracts/enums/VoteTargetType'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { VoteType } from 'Contracts/enums/VoteType'
import User from 'App/Models/User'

export default class VotesController {
  public async index({ request, response }: HttpContextContract) {
    const filterSchema = schema.create({
      threadId: schema.number.optional([rules.exists({ table: 'threads', column: 'id' })]),
      postId: schema.number.optional([rules.exists({ table: 'posts', column: 'id' })]),
    })
    const filter = await request.validate({ schema: filterSchema })
    const targetId = filter.postId ?? filter.threadId

    const votes = await Vote.query().if(targetId, (query) =>
      query
        .where('target_id', targetId as number)
        .andWhere('target_type', filter.postId ? VoteTargetType.POST : VoteTargetType.THREAD)
    )

    return response.json(votes)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user as User
    const targetType = request.input('targetType') as VoteTargetType

    const voteSchema = schema.create({
      type: schema.enum(Object.values(VoteType) as number[]),
      userId: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
      targetId: schema.number([
        rules.exists({
          table: targetType === VoteTargetType.THREAD ? 'threads' : 'posts',
          column: 'id',
        }),
      ]),
      targetType: schema.enum(Object.values(VoteTargetType) as number[]),
    })

    const data = await request.validate({ schema: voteSchema })
    if (user.isAdmin) data.userId = data.userId ?? user.id
    else data.userId = user.id

    try {
      const vote = await Vote.create(data)
      await vote.refresh()
      return response.json(vote)
    } catch (error) {
      return error.code === '23505'
        ? response.conflict({ message: 'Vote already exist' })
        : response.badRequest()
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const voteId = request.param('id')
    const vote = await Vote.query().where('id', voteId).firstOrFail()
    return response.json(vote)
  }

  public async update({ request, response, auth, bouncer }: HttpContextContract) {
    const user = auth.user as User
    const voteId = request.param('id')
    const vote = await Vote.findOrFail(voteId)
    await bouncer.with('VotesPolicy').authorize('update', vote)

    const voteSchema = schema.create({
      type: schema.enum(Object.values(VoteType) as number[]),
      userId: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
    })

    const data = await request.validate({ schema: voteSchema })
    if (user.isAdmin) data.userId = data.userId ?? vote.userId
    else data.userId = vote.userId

    await vote.merge(data).save()

    return response.json(vote)
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const voteId = request.param('id')
    const vote = await Vote.findOrFail(voteId)
    await bouncer.with('VotesPolicy').authorize('update', vote)

    await vote.delete()
    return response.noContent()
  }
}
