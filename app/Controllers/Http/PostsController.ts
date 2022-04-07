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
      sort: schema.enum.optional(['totalUpVotes']),
      order: schema.enum.optional(['asc', 'desc']),
    })
    await request.validate({ schema: sortSchema })

    const posts = await Post.query()
      .if(threadId, (query) => query.where('threadId', threadId))
      .preload('user')
      .apply((scopes) => {
        scopes.withUpVotes()
        scopes.withDownVotes()
      })
      .if(
        sort,
        (query) => {
          query.match(
            [
              order === 'desc',
              (query) => {
                query.orderBy('up_votes_count', order).orderBy('down_votes_count', 'asc')
              },
            ],
            [
              order === 'asc',
              (query) => {
                query.orderBy('up_votes_count', order).orderBy('down_votes_count', 'desc')
              },
            ]
          )
        },
        (query) => query.orderBy('is_pinned', 'desc').orderBy('created_at', 'desc')
      )

    // TODO:  Agregar filtro por fecha

    // .with('votes_score', (query) =>
    //   query
    //     .from('posts')
    //     .select('posts.id', 'posts.up_votes_count', 'posts.down_votes_count')
    //     .withCount('votes', (query) => query.where('type', VoteType.UP_VOTE).as('up_votes_count'))
    //     .withCount('votes', (query) =>
    //       query.where('type', VoteType.DOWN_VOTE).as('down_votes_count')
    //     )
    // )

    return response.json(posts)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user as User

    const postSchema = schema.create({
      content: schema.string({ escape: true }, [rules.maxLength(1000)]),
      threadId: schema.number([rules.exists({ table: 'threads', column: 'id' })]),
      userId: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
    })

    const data = await request.validate({ schema: postSchema })
    data.userId = user.id

    const post = await Post.create(data)
    await post.refresh()

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
