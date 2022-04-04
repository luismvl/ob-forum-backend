import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Post from 'App/Models/Post'

export default class PostsController {
  public async index({ response }: HttpContextContract) {
    const posts = await Post.all()
    return response.json(posts)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const postSchema = schema.create({
      content: schema.string({ escape: true }, [rules.maxLength(1000)]),
      threadId: schema.number(),
    })

    const data = await request.validate({ schema: postSchema })
    const post = await Post.create(data)
    // const user = auth.user
    // thread.related('user').associate(user as User)

    return response.json(post)
  }

  public async show({ request, response }: HttpContextContract) {
    const postId = request.param('id')
    const post = await Post.findOrFail(postId)
    await post.load('votes')
    return response.json(post)
  }

  public async update({ request, response }: HttpContextContract) {
    const postId = request.param('id')
    const postSchema = schema.create({
      content: schema.string({ escape: true }, [rules.maxLength(1000)]),
      // threadId: schema.number()
    })

    const data = await request.validate({ schema: postSchema })

    const post = await Post.findOrFail(postId)
    await post.merge(data).save()

    return response.json(post)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const postId = request.param('id')
    const post = await Post.findOrFail(postId)
    await post.delete()
    response.noContent()
  }
}
