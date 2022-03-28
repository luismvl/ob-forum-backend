import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Forum from 'App/Models/Forum'
import User from 'App/Models/User'
import { VoteTargetType } from 'Contracts/enums/VoteTargetType'
import { VoteType } from 'Contracts/enums/VoteType'

export default class ThreadSeeder extends BaseSeeder {
  public async run() {
    // Trae un user
    const user = await User.findByOrFail('username', 'demo')
    // Trae un foro
    const forum = await Forum.query().where('title', 'React JS').firstOrFail()

    await (
      await (await Forum.query().where('title', 'Angular').firstOrFail())
        .related('subforums')
        .query()
        .where('title', 'Módulo 1')
        .firstOrFail()
    )
      .related('threads')
      .updateOrCreateMany([
        {
          subject: 'Subject of a PINNED thread',
          content: 'Thread content!, it should probably be in html',
          userId: user.id,
          isPinned: true,
        },
      ])

    // Trae el subforo general del foro
    const subforum = await forum
      .related('subforums')
      .query()
      .where('title', 'Módulo 1')
      .firstOrFail()

    // Crea un nuevo thread
    const thread = await subforum.related('threads').updateOrCreateMany(
      [
        {
          subject: 'Subject of the thread',
          content: 'Thread content!, it should probably be in html',
          userId: user.id,
        },
        {
          subject: 'Subject of a PINNED thread',
          content: 'Thread content!, it should probably be in html',
          userId: user.id,
          isPinned: true,
        },
        {
          subject: 'Subject of a pinned thread 2',
          content: 'Thread content!, it should probably be in html',
          userId: user.id,
          isPinned: true,
        },
      ],
      'subject'
    )

    // Crea un post
    await thread[0]
      .related('posts')
      .updateOrCreate({ content: 'Post content!' }, { userId: user.id })

    await thread[0]
      .related('posts')
      .updateOrCreate(
        { content: 'Post content! This post is pinned' },
        { userId: user.id, isPinned: true }
      )

    // Crea un voto para el thread
    await thread[0]
      .related('votes')
      .updateOrCreate(
        { userId: user.id, targetType: VoteTargetType.THREAD, targetId: thread[0].id },
        { type: VoteType.UP_VOTE }
      )
  }
}
