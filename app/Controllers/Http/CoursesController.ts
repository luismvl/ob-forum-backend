import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Course from 'App/Models/Course'

export default class CoursesController {
  public async index({ response }: HttpContextContract) {
    const courses = await Course.query().orderBy('name')
    return response.json(courses)
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CoursePolicy').authorize('create')

    const courseSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.minLength(2),
        rules.unique({ table: 'courses', column: 'name' }),
      ]),
      description: schema.string.optional({ trim: true }),
      iconUrl: schema.string.optional({}, [rules.url()]),
    })
    const data = await request.validate({ schema: courseSchema })

    const course = await Course.create(data)
    await course.refresh()

    return response.json(course)
  }

  public async show({ request, response }: HttpContextContract) {
    const courseId = request.param('id')
    const course = await Course.findOrFail(courseId)
    return response.json(course)
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CoursePolicy').authorize('update')

    const courseId = request.param('id')
    const courseSchema = schema.create({
      name: schema.string.optional({ trim: true }, [
        rules.minLength(2),
        rules.unique({ table: 'courses', column: 'name', caseInsensitive: true }),
      ]),
      description: schema.string.optional({ trim: true }),
      iconUrl: schema.string.optional({}, [rules.url()]),
    })
    const data = await request.validate({ schema: courseSchema })

    const course = await Course.findOrFail(courseId)
    await course.merge(data).save()

    return response.json(course)
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CoursePolicy').authorize('delete')

    const courseId = request.param('id')
    const course = await Course.findOrFail(courseId)
    await course.delete()
    response.noContent()
  }
}
