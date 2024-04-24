import { Entity, IAuthUser, StorableEntity } from '@project/shared/core'

export class BlogUserEntity extends Entity implements StorableEntity<IAuthUser> {
  public email: string
  public username: string
  public passwordHash?: string
  public avatarId?: string
  public createdAt?: Date
  public updatedAt?: Date

  constructor(user?: IAuthUser) {
    console.log(user)
    super()
    this.populate(user)
  }

  public populate(user?: IAuthUser) {
    if (!user) {
      return
    }
    this.id = user.id
    this.email = user.email
    this.username = user.username
    this.passwordHash = user.passwordHash
    this.avatarId = user.avatarId
    this.updatedAt = user.updatedAt
    this.createdAt = user.createdAt
  }

  toPOJO(): IAuthUser {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      avatarId: this.avatarId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  public async setPassword(passwordHash: string): Promise<BlogUserEntity> {
    this.passwordHash = passwordHash
    return this
  }
}
