import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePostDto } from 'libs/post/blog-post/src/blog-post-module/dto/create-post.dto'
import { CommonPostEntity } from 'libs/post/blog-post/src/blog-post-module/entities/common-post.entity'
import { FactoryTypeFactory } from 'libs/post/blog-post/src/blog-post-module/factories/factory-type.factory'
import { RepositoryTypeFactory } from 'libs/post/blog-post/src/blog-post-module/factories/repository-type.factory'
import { CommonPostRepository } from 'libs/post/blog-post/src/blog-post-module/repositories/common-post.repository'

@Injectable()
export class BlogPostService {
  constructor(
    private readonly factoryTypeFactory: FactoryTypeFactory,
    private readonly repositoriesTypeFactory: RepositoryTypeFactory,
    private readonly commonPostRepository: CommonPostRepository
  ) {}

  public async createPost(dto: CreatePostDto) {
    const postFactory = this.factoryTypeFactory.create(dto.type)
    const postRepository = this.repositoriesTypeFactory.create(dto.type)

    if (!postFactory || !postRepository) {
      return
    }

    const entityPost = postFactory.create(dto)
    await postRepository.save(entityPost)

    return entityPost
  }

  public async getPost(id: string): Promise<CommonPostEntity> {
    return await this.commonPostRepository.findById(id)
  }

  public async getAllPosts(): Promise<CommonPostEntity[]> {
    return await this.commonPostRepository.findAll()
  }

  public async deleteCategory(id: string): Promise<void> {
    try {
      await this.commonPostRepository.deleteById(id)
    } catch {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }
  }
}