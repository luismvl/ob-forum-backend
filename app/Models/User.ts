import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Thread from './Thread'
import Post from './Post'
import Notification from './Notification'
import Vote from './Vote'
import Forum from './Forum'
import Subforum from './Subforum'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public fullname: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public pictureUrl?: string

  @column()
  public isAdmin: boolean

  @column()
  public rememberMeToken?: string

  @hasMany(() => Thread)
  public threads: HasMany<typeof Thread>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  @hasMany(() => Vote)
  public votes: HasMany<typeof Vote>

  @manyToMany(() => Thread, {
    pivotTable: 'follower_threads',
  })
  public followedThreads: ManyToMany<typeof Thread>

  @manyToMany(() => Forum, {
    pivotTable: 'follower_forums',
  })
  public followedForums: ManyToMany<typeof Forum>

  @manyToMany(() => Subforum, {
    pivotTable: 'follower_subforums',
  })
  public followedSubforums: ManyToMany<typeof Subforum>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
