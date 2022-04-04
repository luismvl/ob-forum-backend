import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Subforum from 'App/Models/Subforum'
import User from 'App/Models/User'

export default class SubforumsController {
  public async index({ request, response, auth }: HttpContextContract) {
    const user = auth.user as User
    const courseId = request.input('courseId')
    const moduleId = request.input('moduleId')
    const userCourses = await user.related('courses').query()

    let subforums = await Subforum.query()
      .if(courseId, (query) => {
        query.andWhere('courseId', courseId)
      })
      .if(moduleId, (query) => {
        query.andWhere('moduleId', moduleId)
      })
      // Si no es admin solo trae los subforos a los que el usuario tiene acceso
      .if(!user.isAdmin, (query) =>
        query.whereIn(
          'course_id',
          userCourses.map((f) => f.id)
        )
      )
      .orderBy('is_pinned', 'desc')
      .preload('threads')
      .withCount('threads')

    return subforums.length === 0
      ? response.notFound()
      : subforums.length === 1
      ? response.json(subforums[0])
      : response.json(subforums)
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SubforumPolicy').authorize('create')

    const subforumSchema = schema.create({
      title: schema.string({ trim: true }, [rules.minLength(2)]),
      description: schema.string(),
      isPinned: schema.boolean.optional(),
      courseId: schema.number(),
      moduleId: schema.number.optional(),
    })

    const data = await request.validate({ schema: subforumSchema })
    const subforum = await Subforum.create(data)
    await subforum.refresh()

    return response.json(subforum)
  }

  public async show({ request, response, bouncer }: HttpContextContract) {
    const subforumId = request.param('id')

    const subforum = await Subforum.query()
      .where('id', subforumId)
      .preload('threads')
      .withCount('threads')
      .firstOrFail()

    await bouncer.with('SubforumPolicy').authorize('view', subforum)
    return response.json(subforum)
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SubforumPolicy').authorize('update')

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

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SubforumPolicy').authorize('delete')

    const moduleId = request.param('id')
    const module = await Subforum.findOrFail(moduleId)
    await module.delete()
    response.noContent()
  }
}
