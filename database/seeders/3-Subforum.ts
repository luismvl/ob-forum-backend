import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'

export default class ForumSeeder extends BaseSeeder {
  public async run() {
    const courses = await Course.query().preload('modules')

    // Crea los subforos 'General', 'Errores' y 'Proyectos' para cada curso
    for await (const course of courses) {
      await course.related('subforums').updateOrCreateMany(
        [
          {
            title: 'General',
            description: 'Dudas generales',
            isPinned: true,
          },
          {
            title: 'Errores',
            description: 'Errores',
            isPinned: true,
          },
          {
            title: 'Proyectos',
            description: 'Proyectos',
            isPinned: true,
          },
        ],
        'title'
      )
    }

    // Crea subforos para cada módulo de cada curso
    for await (const course of courses) {
      await Promise.all(
        course.modules.map((module) => {
          return course
            .related('subforums')
            .updateOrCreate(
              { title: module.title },
              { description: module.description, moduleId: module.id }
            )
        })
      )
    }
  }
}
