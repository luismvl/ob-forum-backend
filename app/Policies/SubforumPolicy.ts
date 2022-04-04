import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Subforum from 'App/Models/Subforum'

export default class SubforumPolicy extends BasePolicy {
  public async viewList() {
    return true
  }
  public async view(user: User, subforum: Subforum) {
    if (user.isAdmin) return true

    const userCourses = await user.related('courses').query()

    return userCourses.map((c) => c.id).includes(subforum.courseId)
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
