import { Injectable } from '@nestjs/common'
import { EntityFactory, IPost, PostType } from '@project/shared/core'
import { FactoriesType } from 'libs/post/blog-post/src/decorators/factories-type.decorator'
import { QuotePostEntity } from 'libs/post/blog-post/src/entities/quote-post.entity'

@Injectable()
@FactoriesType(PostType.Quote)
export class QuotePostFactory implements EntityFactory<QuotePostEntity> {
  create(entityPlainData: IPost): QuotePostEntity {
    return new QuotePostEntity(entityPlainData)
  }
}
