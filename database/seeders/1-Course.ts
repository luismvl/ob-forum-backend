import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'

export default class CourseSeeder extends BaseSeeder {
  public async run() {
    await Course.updateOrCreateMany(
      ['name'],
      [
        {
          name: 'React JS',
        },
        {
          name: 'Angular',
        },
        {
          name: 'Spring',
        },
        {
          name: 'JavaScript',
        },
        {
          name: 'Git',
        },
      ]
    )
  }
}
