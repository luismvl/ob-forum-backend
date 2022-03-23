import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TestsController {
  public async testlogin({ request, response, auth }: HttpContextContract) {
    // Get op and all other posts in asc order by date
    // const op = await thread.related('posts').query().orderBy('createdAt', 'asc').firstOrFail()
    // const posts = await thread.load('posts', (query) => {
    //   query.orderBy('createdAt', 'asc').andWhereNot('createdAt', op.createdAt.toSQL())
    // })

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
}
