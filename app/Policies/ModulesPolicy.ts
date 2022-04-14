import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
// import Module from 'App/Models/Module'

export default class ModulesPolicy extends BasePolicy {
  public async viewList() {
    return true
  }
  public async view() {
    return true
  }
  public async create(user: User) {
    return user.isAdmin
  }
  public async update(user: User) {
    return user.isAdmin
  }
  public async delete(user: User) {
    return user.isAdmin
  }
}
