import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'
import User from 'App/Models/User'
import { VoteTargetType } from 'Contracts/enums/VoteTargetType'
import { VoteType } from 'Contracts/enums/VoteType'

export default class ThreadSeeder extends BaseSeeder {
  public async run() {
    // Trae un user
    const user = await User.findByOrFail('username', 'demo')
    // Trae un foro
    const course1 = await Course.query().where('title', 'React JS').firstOrFail()

    // Trae el subforo general del foro
    const subforum1 = await course1
      .related('subforums')
      .query()
      .where('title', 'Módulo 1')
      .firstOrFail()

    // Crea un nuevo thread
    const thread = await subforum1.related('threads').updateOrCreateMany(
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

    // Crea un post pineado
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

    const course2 = await Course.query().where('title', 'Angular').firstOrFail()

    const subforums2 = await course2
      .related('subforums')
      .query()
      .where('title', 'Módulo 1')
      .firstOrFail()

    await subforums2.related('threads').updateOrCreateMany([
      {
        subject: 'Subject of a PINNED thread',
        content: 'Thread content!, it should probably be in html',
        userId: user.id,
        isPinned: true,
      },
    ])
  }
}
