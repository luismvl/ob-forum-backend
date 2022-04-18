import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string.optional({ trim: true }, [rules.requiredIfNotExists('username')]),
      username: schema.string.optional({ trim: true }, [rules.requiredIfNotExists('email')]),
      password: schema.string(),
    })
    const messages = {
      requiredIfNotExists: 'Must provide either email or username',
    }

    const data = await request.validate({ schema: loginSchema, messages })

    const token = await auth
      .use('api')
      .attempt((data.email || data.username) as string, data.password, {
        expiresIn: '10 days',
      })

    return token.toJSON()
  }

  public async register({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email({ sanitize: true }),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      username: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(16),
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      password: schema.string(),
      fullname: schema.string(),
      pictureUrl: schema.string.optional({}, [rules.url()]),
    })
    const data = await request.validate({ schema: userSchema })

    const user = await User.create(data)
    await user.refresh()

    return response.json(user)
  }
}
