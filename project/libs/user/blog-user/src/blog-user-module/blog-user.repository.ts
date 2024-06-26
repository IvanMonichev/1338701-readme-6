import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BaseMongoRepository } from '@project/data-access'
import { BlogUserEntity } from 'libs/user/blog-user/src/blog-user-module/blog-user.entity'
import { BlogUserFactory } from 'libs/user/blog-user/src/blog-user-module/blog-user.factory'
import { BlogUserModel } from 'libs/user/blog-user/src/blog-user-module/bog-user.model'
import { Model } from 'mongoose'

@Injectable()
export class BlogUserRepository extends BaseMongoRepository<BlogUserEntity, BlogUserModel> {
  constructor(
    protected readonly entityFactory: BlogUserFactory,
    @InjectModel(BlogUserModel.name) blogUserModel: Model<BlogUserModel>
  ) {
    super(entityFactory, blogUserModel)
  }

  public async findByEmail(email: string): Promise<BlogUserEntity | null> {
    const document = await this.model.findOne({ email }).exec()
    if (!document) {
      return null
    }
    return this.createEntityFromDocument(document)
  }

  public async findManyByIds(userIds: string[]) {
    const users = await this.model.find({ _id: { $in: userIds } }).exec()
    const foundUserIds = users.map((user) => user._id.toString())
    const missingUserIds = userIds.filter((userId) => !foundUserIds.includes(userId))

    if (missingUserIds.length > 0) {
      throw new NotFoundException(`Users with the following IDs not found: ${missingUserIds.join(', ')}`)
    }

    return users.map((document) => this.createEntityFromDocument(document))
  }
}
