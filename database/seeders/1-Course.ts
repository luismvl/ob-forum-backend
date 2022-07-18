import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'

export default class CourseSeeder extends BaseSeeder {
  public async run() {
    await Course.updateOrCreateMany(
      ['name'],
      [
        {
          name: 'React JS',
          iconUrl:
            'https://res.cloudinary.com/dspkak5d0/image/upload/v1658106136/course-icons/react_kkzqxd.svg',
        },
        {
          name: 'Angular',
          iconUrl:
            'https://res.cloudinary.com/dspkak5d0/image/upload/v1658103541/course-icons/angular-icon_wkvm5x.svg',
        },
        {
          name: 'Spring',
          iconUrl:
            'https://res.cloudinary.com/dspkak5d0/image/upload/v1658106244/course-icons/spring_acy6g3.svg',
        },
        {
          name: 'JavaScript',
          iconUrl:
            'https://res.cloudinary.com/dspkak5d0/image/upload/v1658106244/course-icons/javascript_wnkw55.svg',
        },
        {
          name: 'Git',
          iconUrl:
            'https://res.cloudinary.com/dspkak5d0/image/upload/v1658106244/course-icons/git_wb3whl.svg',
        },
      ]
    )
  }
}
