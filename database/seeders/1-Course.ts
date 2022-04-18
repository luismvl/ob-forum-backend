import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'

export default class CourseSeeder extends BaseSeeder {
  public async run() {
    await Course.updateOrCreateMany(
      ['title'],
      [
        {
          title: 'React JS',
        },
        {
          title: 'Angular',
        },
        {
          title: 'Spring',
        },
        {
          title: 'JavaScript',
        },
        {
          title: 'Git',
        },
      ]
    )
  }
}
