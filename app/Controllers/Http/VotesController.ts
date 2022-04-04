import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vote from 'App/Models/Vote'

export default class VotesController {
  public async index({ response }: HttpContextContract) {
    const votes = await Vote.query()
    .preload('post')
    .preload('thread')
    return response.json(votes)
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
