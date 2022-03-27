import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Subforum from 'App/Models/Subforum'

export default class SubforumsController {
  public async index({ response }: HttpContextContract) {
    const subforums = await Subforum.all()
    return response.json(subforums)
  }

  public async store({ request, response }: HttpContextContract) {
    // if (!auth.user?.isAdmin) {
    //   return response.unauthorized()
    // }
    const subforumSchema = schema.create({
      title: schema.string({ trim: true }, [rules.minLength(2)]),
      description: schema.string(),
      isPinned: schema.boolean.optional(),
      forumId: schema.number(),
      moduleId: schema.number.optional(),
    })

    const data = await request.validate({ schema: subforumSchema })
    const subforum = await Subforum.create(data)

    return response.json(subforum)
  }

  public async show({ request, response }: HttpContextContract) {
    const subforumId = request.param('id')
    const subforum = await Subforum.findOrFail(subforumId)
    return response.json(subforum)
  }

  public async update({ request, response }: HttpContextContract) {
    const subforumId = request.param('id')
    const subforumSchema = schema.create({
      title: schema.string.optional({ trim: true }, [rules.minLength(2)]),
      description: schema.string.optional(),
      isPinned: schema.boolean.optional(),
      forumId: schema.number.optional(),
      moduleId: schema.number.optional(),
    })

    const data = await request.validate({ schema: subforumSchema })

    const subforum = await Subforum.findOrFail(subforumId)
    await subforum.merge(data).save()

    return response.json(subforum)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const moduleId = request.param('id')
    const module = await Subforum.findOrFail(moduleId)
    await module.delete()
    response.noContent()
  }
}
