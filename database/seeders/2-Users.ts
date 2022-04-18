import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
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
  }
}
