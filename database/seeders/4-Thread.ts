import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Forum from 'App/Models/Forum'
import User from 'App/Models/User'

export default class ThreadSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const user = await User.findByOrFail('username', 'demo')
    const forum = await Forum.query().where('title', 'Angular').firstOrFail()

    const subforum = await forum
      .related('subforums')
      .query()
      .where('title', 'General')
      .firstOrFail()

    // const thread = new Thread()
    // thread.subject = 'Subject of the thread'
    // thread.content = 'Thread content!, it should be in html probably'
    // thread.userId = user.id

    const thread = await subforum
      .related('threads')
      .updateOrCreate(
        { subject: 'Subject of the thread' },
        { content: 'Thread content!, it should probably be in html', userId: user.id }
      )

    await thread.related('posts').updateOrCreate({ content: 'Post content!' }, { userId: user.id })
  }
}
