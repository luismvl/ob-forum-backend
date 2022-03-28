import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'

export default class CourseSeeder extends BaseSeeder {
  public async run() {
    const courses = await Course.updateOrCreateMany(
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

    courses.forEach(async (course) => {
      await course.related('modules').updateOrCreateMany(
        [
          {
            title: 'Módulo 1',
            description: `Descripción del módulo 1 de ${course.title}`,
          },
          {
            title: 'Módulo 2',
            description: `Descripción del módulo 2 de ${course.title}`,
          },
        ],
        ['title', 'description']
      )
    })
  }
}
