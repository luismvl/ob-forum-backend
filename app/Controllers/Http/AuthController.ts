import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const username = request.input('username')
    const password = request.input('password')
    const token = await auth.use('api').attempt(username, password, {
      expiresIn: '10 days',
    })

    return token.toJSON()
  }

  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate(RegisterValidator)
    // Add schema validation
    const user = await User.create(data)

    return response.json(user)
  }
}
