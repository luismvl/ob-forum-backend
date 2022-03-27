import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Thread from 'App/Models/Thread'
import User from 'App/Models/User'

export default class ThreadsController {
  public async index({ response }: HttpContextContract) {
    const threads = await Thread.all()
    return response.json(threads)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const threadSchema = schema.create({
      subject: schema.string({ trim: true }, [rules.maxLength(100)]),
      content: schema.string({ escape: true }, [rules.maxLength(1000)]),
      isPinned: schema.boolean.optional(),
      subforumId: schema.number(),
    })

    const data = await request.validate({ schema: threadSchema })
    const thread = await Thread.create(data)
    // const user = auth.user
    // thread.related('user').associate(user as User)

    return response.json(thread)
  }

  public async show({ request, response }: HttpContextContract) {
    const threadId = request.param('id')
    const thread = await Thread.findOrFail(threadId)
    return response.json(thread)
  }

  public async update({ request, response }: HttpContextContract) {
    const threadId = request.param('id')
    const threadSchema = schema.create({
      subject: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
      content: schema.string.optional({ escape: true }, [rules.maxLength(1000)]),
      isPinned: schema.boolean.optional(),
      // userId: schema.number.optional(),
      subforumId: schema.number.optional(),
    })

    const data = await request.validate({ schema: threadSchema })

    const thread = await Thread.findOrFail(threadId)
    await thread.merge(data).save()

    return response.json(thread)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const threadId = request.param('id')
    const thread = await Thread.findOrFail(threadId)
    await thread.delete()
    response.noContent()
  }
}
