import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vote from 'App/Models/Vote'
import { VoteType } from 'Contracts/enums/VoteType'

export default class TestsController {
  public async testlogin({ request, response, auth }: HttpContextContract) {
    const username = request.input('username')
    const password = request.input('password')

    const token = await auth.use('api').attempt(username, password, {
      expiresIn: '10 days',
    })

    return response.json(token)
  }

  public async testauth({ response }: HttpContextContract) {
    return response.json({
      logged: true,
    })
  }

  public async testvote({ request, response }: HttpContextContract) {
    const vote = await Vote.create({
      userId: 2,
      postId: 1,
      type: VoteType.UP_VOTE
    })
    return response.json({ vote })
  }
}
