import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
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

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'minLength': '{{ field }} detener al menos {{ options.minLength }} caracteres',
    'maxLength': '{{ field }} no puede tener mas de {{ options.minLength }} caracteres',
    'unique': '{{ field }} ya existe',
    'username.required': 'Usuario es requerido',
  }
}
