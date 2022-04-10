import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Vote from 'App/Models/Vote'

export default class VotesPolicy extends BasePolicy {
  public async viewList() {
    return true
  }
  public async view() {
    return true
  }
  public async create() {
    return true
  }
  public async update(user: User, vote: Vote) {
    if (user.isAdmin) return true

    return vote.userId === user.id
  }
  public async delete(user: User, vote: Vote) {
    if (user.isAdmin) return true

    return vote.userId === user.id
  }
}
