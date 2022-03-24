import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Course from 'App/Models/Course'

export default class CoursesController {
  public async index({ response }: HttpContextContract) {
    const courses = await Course.all()
    return response.json(courses)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const courseSchema = schema.create({
      title: schema.string({ trim: true }, [
        rules.minLength(2),
        rules.unique({ table: 'courses', column: 'title' }),
      ]),
      description: schema.string.optional(),
      iconUrl: schema.string.optional({}, [rules.url()]),
    })

    const user = auth.user

    const data = await request.validate({ schema: courseSchema })
    const course = await Course.create(data)
    await user?.related('courses').save(course)

    return response.json({ course, user })
  }

  public async show({ request, response }: HttpContextContract) {
    const courseId = request.param('id')
    const course = await Course.findOrFail(courseId)
    return response.json(course)
  }

  public async update({ request, response }: HttpContextContract) {
    const courseId = request.param('id')
    const courseSchema = schema.create({
      title: schema.string.optional({ trim: true }, [
        rules.minLength(2),
        rules.unique({ table: 'courses', column: 'title' }),
      ]),
      description: schema.string.optional(),
      iconUrl: schema.string.optional({}, [rules.url()]),
    })

    const data = await request.validate({ schema: courseSchema })
    const course = await Course.findOrFail(courseId)
    course.title = data.title || course.title
    course.description = data.description || course.description
    course.iconUrl = data.iconUrl || course.iconUrl
    await course.save()
    return response.json(course)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const courseId = request.param('id')
    const course = await Course.findOrFail(courseId)
    await course.delete()
    response.noContent()
  }
}
