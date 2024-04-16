import { Injectable } from '@nestjs/common'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ModuleRef } from '@nestjs/core'
import { BasePostgresRepository } from '@project/data-access'
import { PostType } from '@project/shared/core'
import { REPOSITORIES_METADATA_KEY } from 'libs/post/blog-post/src/blog-post.constant'
import { RepositoryType } from 'libs/post/blog-post/src/decorators/repository-type.decorator'

@Injectable()
export class RepositoryTypeFactory {
  constructor(private moduleRef: ModuleRef) {}

  public create(type: PostType): BasePostgresRepository<any> | undefined {
    const definedRepositories: Map<string, Constructor<any>> = Reflect.getOwnMetadata(
      REPOSITORIES_METADATA_KEY,
      RepositoryType
    )
    const repository = definedRepositories.get(type)
    if (repository) {
      return this.moduleRef.get(repository)
    }
  }
}
