import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Module from 'App/Models/Module'

export default class ModulesController {
  public async index({ response }: HttpContextContract) {
    const modules = await Module.all()
    return response.json(modules)
  }

  public async store({ request, response }: HttpContextContract) {
    // if (!auth.user?.isAdmin) {
    //   return response.unauthorized()
    // }
    const moduleSchema = schema.create({
      title: schema.string({ trim: true }, [rules.minLength(2)]),
      description: schema.string.optional(),
      courseId: schema.number(),
    })

    const data = await request.validate({ schema: moduleSchema })
    const module = await Module.create(data)

    return response.json(module)
  }

  public async show({ request, response }: HttpContextContract) {
    const moduleId = request.param('id')
    const module = await Module.findOrFail(moduleId)
    return response.json(module)
  }

  public async update({ request, response }: HttpContextContract) {
    const moduleId = request.param('id')
    const moduleSchema = schema.create({
      title: schema.string.optional({ trim: true }, [rules.minLength(2)]),
      description: schema.string.optional(),
      courseId: schema.number.optional(),
    })

    const data = await request.validate({ schema: moduleSchema })

    const module = await Module.findOrFail(moduleId)
    await module.merge(data).save()

    return response.json(module)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const moduleId = request.param('id')
    const module = await Module.findOrFail(moduleId)
    await module.delete()
    response.noContent()
  }
}
