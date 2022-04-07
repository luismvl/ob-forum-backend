import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Thread from 'App/Models/Thread'
import User from 'App/Models/User'

export default class ThreadsController {
  public async index({ request, response }: HttpContextContract) {
    const subforumId = request.input('subforumId')

    const threads = await Thread.query()
      .if(subforumId, (query) => query.where('subforumId', subforumId))
      .preload('user')
      .withCount('posts')
      .orderBy('is_pinned', 'desc')

    return response.json(threads)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user as User

    const threadSchema = schema.create({
      subject: schema.string({ trim: true }, [rules.maxLength(100)]),
      content: schema.string({ escape: true }, [rules.maxLength(1000)]),
      isPinned: schema.boolean.optional(),
      subforumId: schema.number([rules.exists({ table: 'subforums', column: 'id' })]),
      userId: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
    })

    const data = await request.validate({ schema: threadSchema })

    if (user.isAdmin) data.userId = data.userId ?? user.id
    else data.userId = user.id

    const thread = await Thread.create(data)
    await thread.refresh()

    return response.json(thread)
  }

  public async show({ request, response }: HttpContextContract) {
    const threadId = request.param('id')

    const thread = await Thread.query()
      .where('id', threadId)
      .preload('posts', (query) =>
        query
          .apply((scopes) => {
            scopes.withUpVotes()
            scopes.withDownVotes()
          })
          .preload('user')
      )
      .apply((scopes) => {
        scopes.withUpVotes()
        scopes.withDownVotes()
      })
      .firstOrFail()

    return response.json(thread)
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    const user = auth.user as User
    const threadId = request.param('id')
    const thread = await Thread.findOrFail(threadId)

    const threadSchema = schema.create({
      subject: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
      content: schema.string.optional({ escape: true }, [rules.maxLength(1000)]),
      isPinned: schema.boolean.optional(),
      subforumId: schema.number.optional([rules.exists({ table: 'subforums', column: 'id' })]),
    })

    const data = await request.validate({ schema: threadSchema })
    await bouncer.with('ThreadsPolicy').authorize('update', thread)
    if (user.isAdmin) data.isPinned = data.isPinned ?? thread.isPinned
    else data.isPinned = thread.isPinned
    await thread.merge(data).save()

    return response.json(thread)
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const threadId = request.param('id')
    const thread = await Thread.findOrFail(threadId)

    await bouncer.with('ThreadsPolicy').authorize('delete', thread)
    await thread.delete()

    response.noContent()
  }
}
