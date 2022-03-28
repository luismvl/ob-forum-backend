import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'
import User from 'App/Models/User'

export default class UsersSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    await User.updateOrCreateMany(
      ['username', 'email'],
      [
        {
          email: 'demo@mail.com',
          username: 'demo',
          password: 'demo',
          fullname: 'Demo Full Name',
        },
        {
          email: 'admin@mail.com',
          username: 'admin',
          password: 'admin',
          fullname: 'Admin Full Name',
          isAdmin: true,
        },
      ]
    )

    const userDemo = await User.findByOrFail('username', 'demo')
    const courseAngular = await Course.query().where('title', 'Angular').firstOrFail()

    await userDemo.related('courses').attach([1])
    await userDemo.related('courses').attach([courseAngular.id])
  }
}
