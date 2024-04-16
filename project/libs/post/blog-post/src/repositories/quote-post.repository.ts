import { Injectable } from '@nestjs/common'
import { BaseMemoryRepository } from '@project/data-access'
import { PostType } from '@project/shared/core'
import { RepositoryType } from 'libs/post/blog-post/src/decorators/repository-type.decorator'
import { QuotePostEntity } from 'libs/post/blog-post/src/entities/quote-post.entity'
import { QuotePostFactory } from 'libs/post/blog-post/src/factories/quote-post.factory'

@Injectable()
@RepositoryType(PostType.Quote)
export class QuotePostRepository extends BaseMemoryRepository<QuotePostEntity> {
  constructor(protected readonly entityFactory: QuotePostFactory) {
    super(entityFactory)
  }
}
