import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Thread from 'App/Models/Thread'

export default class ThreadsPolicy extends BasePolicy {
  public async viewList() {
    return true
  }
  public async view() {
    return true
  }
  public async create() {
    return true
  }
  public async update(user: User, thread: Thread) {
    if (user.isAdmin) return true

    return user.id === thread.userId
  }
  public async delete(user: User, thread: Thread) {
    if (user.isAdmin) return true

    return user.id === thread.userId
  }
}
