import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Forum from 'App/Models/Forum'
import Subforum from 'App/Models/Subforum'
import User from 'App/Models/User'

export default class SubforumsController {
  public async index({ request, response, auth }: HttpContextContract) {
    const user = auth.user as User
    const courseId = request.input('courseId')
    const moduleId = request.input('moduleId')
    const userCourses = await user.related('courses').query()

    // Foros a los que el usuario tiene acceso
    const forums = await Forum.query()
      .if(courseId, (query) => query.where('course_id', courseId))
      .whereIn(
        'course_id',
        userCourses.map((c) => c.id)
      )

    let subforums = await Subforum.query()
      .if(moduleId, (query) => {
        query.andWhere('moduleId', moduleId)
      })
    // Si no es admin solo trae los subforos a los que el usuario tiene acceso
      .if(!user.isAdmin, (query) =>
        query.whereIn(
          'forum_id',
          forums.map((f) => f.id)
        )
      )
      .orderBy('is_pinned', 'desc')
      .preload('threads')

      const subforumsObj = subforums.map(sf => sf.toObject())

    return subforums.length === 0
      ? response.notFound()
      : subforums.length === 1
      ? response.json(subforumsObj[0])
      : response.json(subforumsObj)
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SubforumPolicy').authorize('create')

    const subforumSchema = schema.create({
      title: schema.string({ trim: true }, [rules.minLength(2)]),
      description: schema.string(),
      isPinned: schema.boolean.optional(),
      forumId: schema.number(),
      moduleId: schema.number.optional(),
    })

    const data = await request.validate({ schema: subforumSchema })
    const subforum = await Subforum.create(data)
    await subforum.refresh()

    return response.json(subforum.toObject())
  }

  public async show({ request, response, bouncer }: HttpContextContract) {
    const subforumId = request.param('id')
    const subforum = await Subforum.findOrFail(subforumId)
    await subforum.load('threads')

    await bouncer.with('SubforumPolicy').authorize('view', subforum)
    return response.json(subforum.toObject())
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

    return response.json(subforum.toObject())
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SubforumPolicy').authorize('delete')

    const moduleId = request.param('id')
    const module = await Subforum.findOrFail(moduleId)
    await module.delete()
    response.noContent()
  }
}
