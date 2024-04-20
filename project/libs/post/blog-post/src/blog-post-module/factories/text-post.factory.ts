import { Injectable } from '@nestjs/common'
import { IEntityFactory, IPost, PostType } from '@project/shared/core'
import { FactoriesType } from 'libs/post/blog-post/src/blog-post-module/decorators/factories-type.decorator'
import { TextPostEntity } from 'libs/post/blog-post/src/blog-post-module/entities/text-post.entity'

@Injectable()
@FactoriesType(PostType.Text)
export class TextPostFactory implements IEntityFactory<TextPostEntity> {
  create(entityPlainData: IPost): TextPostEntity {
    return new TextPostEntity(entityPlainData)
  }
}
