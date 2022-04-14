import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
// import Course from 'App/Models/Course'

export default class CoursePolicy extends BasePolicy {
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
