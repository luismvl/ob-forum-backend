import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export default class PostsController {
  public async index({ request, response }: HttpContextContract) {
    const threadId = request.input('threadId')
    const sort = request.input('sort')
    const order = request.input('order')

    const sortSchema = schema.create({
      sort: schema.enum.optional(['totalUpVotes', 'updated_at']),
      order: schema.enum.optional(['asc', 'desc']),
    })
    await request.validate({ schema: sortSchema })

    const posts = await Post.query()
      .if(threadId, (query) => query.where('threadId', threadId))
      .preload('user', (query) => query.select('id', 'username', 'picture_url'))
      .apply((scopes) => {
        scopes.withUpVotes()
        scopes.withDownVotes()
      })
      .match(
        [
          sort === 'totalUpVotes',
          (query) => query.apply((scopes) => scopes.orderByTotalUpVotes(order)),
        ],
        [sort === 'updated_at', (query) => query.apply((scopes) => scopes.orderByUpdated(order))],
        (query) => query.orderBy('is_pinned', 'desc').orderBy('updated_at', 'desc')
      )

    return response.json(posts)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user as User

    const postSchema = schema.create({
      content: schema.string({ escape: true }, [rules.maxLength(1000)]),
      threadId: schema.number([rules.exists({ table: 'threads', column: 'id' })]),
      userId: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
      isPinned: schema.boolean.optional(),
    })

    const data = await request.validate({ schema: postSchema })
    if (user.isAdmin) {
      data.userId = data.userId ?? user.id
      data.isPinned = data.isPinned ?? false
    } else {
      data.userId = user.id
      data.isPinned = false
    }

    const post = await Post.create(data)
    await post.refresh()

    return response.json(post)
  }

  public async show({ request, response }: HttpContextContract) {
    const postId = request.param('id')
    const post = await Post.query()
      .where('id', postId)
      .apply((scopes) => {
        scopes.withUpVotes()
        scopes.withDownVotes()
      })
      .preload('user', (query) => query.select('id', 'username', 'picture_url'))
      .firstOrFail()

    return response.json(post)
  }

  public async update({ request, response, auth, bouncer }: HttpContextContract) {
    const user = auth.user as User
    const postId = request.param('id')
    const post = await Post.findOrFail(postId)

    const postSchema = schema.create({
      content: schema.string({ escape: true }, [rules.maxLength(1000)]),
      isPinned: schema.boolean.optional(),
      // threadId: schema.number()
    })

    const data = await request.validate({ schema: postSchema })
    await bouncer.with('PostsPolicy').authorize('update', post)
    if (user.isAdmin) data.isPinned = data.isPinned ?? post.isPinned
    else data.isPinned = post.isPinned

    await post.merge(data).save()

    return response.json(post)
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const postId = request.param('id')
    const post = await Post.findOrFail(postId)

    await bouncer.with('PostsPolicy').authorize('delete', post)
    await post.delete()
    response.noContent()
  }
}
