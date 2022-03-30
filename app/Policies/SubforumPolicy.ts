import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Subforum from 'App/Models/Subforum'
import Forum from 'App/Models/Forum'

export default class SubforumPolicy extends BasePolicy {
  public async viewList() {
    return true
  }
  public async view(user: User, subforum: Subforum) {
    if (user.isAdmin) return true

    const userCourses = await user.related('courses').query()
    const forums = await Forum.query().whereIn(
      'course_id',
      userCourses.map((c) => c.id)
    )
    return forums.map((f) => f.id).includes(subforum.forumId)
  }
  public async create(user: User) {
    if (user.isAdmin) return true

    return false
  }
  public async update(user: User) {
    if (user.isAdmin) return true

    return false
  }
  public async delete(user: User) {
    if (user.isAdmin) return true

    return false
  }
}
