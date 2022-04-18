import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Module from 'App/Models/Module'

export default class ModulesController {
  public async index({ response }: HttpContextContract) {
    const modules = await Module.all()
    return response.json(modules)
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ModulesPolicy').authorize('create')

    const moduleSchema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(2)]),
      description: schema.string.optional({ trim: true }),
      courseId: schema.number(),
    })

    const data = await request.validate({ schema: moduleSchema })
    const module = await Module.create(data)
    await module.refresh()

    return response.json(module)
  }

  public async show({ request, response }: HttpContextContract) {
    const moduleId = request.param('id')
    const module = await Module.findOrFail(moduleId)
    return response.json(module)
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ModulesPolicy').authorize('update')

    const moduleId = request.param('id')
    const moduleSchema = schema.create({
      name: schema.string.optional({ trim: true }, [rules.minLength(2)]),
      description: schema.string.optional({ trim: true }),
      courseId: schema.number.optional(),
    })
    const data = await request.validate({ schema: moduleSchema })

    const module = await Module.findOrFail(moduleId)
    await module.merge(data).save()

    return response.json(module)
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ModulesPolicy').authorize('delete')

    const moduleId = request.param('id')
    const module = await Module.findOrFail(moduleId)
    await module.delete()
    response.noContent()
  }
}
