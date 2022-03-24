import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'
import Forum from 'App/Models/Forum'

export default class ForumSeeder extends BaseSeeder {
  public async run() {
    const courses = await Course.query().preload('modules')

    // Crea un foro por cada curso
    for await (const course of courses) {
      await Forum.updateOrCreate({ title: course.title }, { courseId: course.id })
    }

    const forums = await Forum.query().preload('course', (q) => q.preload('modules'))

    // Crea los subforos 'General', 'Errores' y 'Proyectos' para cada curso
    for await (const forum of forums) {
      await forum.related('subforums').updateOrCreateMany(
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
    for await (const forum of forums) {
      await Promise.all(
        forum.course.modules.map((module) => {
          return forum
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
