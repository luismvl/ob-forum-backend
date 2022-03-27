import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Forum from 'App/Models/Forum'

export default class ForumsController {
  public async index({ response }: HttpContextContract) {
    const forums = await Forum.all()
    return response.json(forums)
  }

  public async store({ request, response }: HttpContextContract) {
    // if (!auth.user?.isAdmin) {
    //   return response.unauthorized()
    // }
    const forumSchema = schema.create({
      title: schema.string({ trim: true }, [
        rules.minLength(2),
        rules.unique({ table: 'forums', column: 'title' }),
      ]),
      courseId: schema.number.optional(),
    })

    const data = await request.validate({ schema: forumSchema })
    const forum = await Forum.create(data)

    return response.json(forum)
  }

  public async show({ request, response }: HttpContextContract) {
    const forumId = request.param('id')
    const forum = await Forum.findOrFail(forumId)
    return response.json(forum)
  }

  public async update({request, response}: HttpContextContract) {
    const forumId = request.param('id')
    const forumSchema = schema.create({
      title: schema.string.optional({ trim: true }, [
        rules.minLength(2),
        rules.unique({ table: 'forums', column: 'title' }),
      ]),
      courseId: schema.number.optional(),
    })

    const data = await request.validate({ schema: forumSchema})

    const forum = await Forum.findOrFail(forumId)
    await forum.merge(data).save()

    return response.json(forum)
  }

  public async destroy({ request, response}: HttpContextContract) {
    const forumId = request.param('id')
    const forum = await Forum.findOrFail(forumId)
    await forum.delete()
    return response.noContent()
  }
}
