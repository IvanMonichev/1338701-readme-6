import { Injectable, NotFoundException } from '@nestjs/common'
import { BlogCommentEntity, BlogCommentFactory, CreateCommentDto } from '@project/blog-comment'
import { BlogTagEntity } from '@project/blog-tag'
import { IPost, PaginationResult } from '@project/shared/core'
import { BlogCommentRepository } from 'libs/post/blog-comment/src/blog-comment-module/blog-comment.repository'
import { BlogPostQuery } from 'libs/post/blog-post/src/blog-post-module/blog-post.query'
import { CreatePostDto } from 'libs/post/blog-post/src/blog-post-module/dto/create-post.dto'
import { UpdatePostDto } from 'libs/post/blog-post/src/blog-post-module/dto/update-post.dto'
import { BasePostEntity } from 'libs/post/blog-post/src/blog-post-module/entities/base-post.entity'
import { CommonPostEntity } from 'libs/post/blog-post/src/blog-post-module/entities/common-post.entity'
import { CommonPostFactory } from 'libs/post/blog-post/src/blog-post-module/factories/common-post.factory'
import { FactoryTypeFactory } from 'libs/post/blog-post/src/blog-post-module/factories/factory-type.factory'
import { RepositoryTypeFactory } from 'libs/post/blog-post/src/blog-post-module/factories/repository-type.factory'
import { CommonPostRepository } from 'libs/post/blog-post/src/blog-post-module/repositories/common-post.repository'
import { BlogTagService } from 'libs/post/blog-tag/src/blog-tag-module/blog-tag.service'

@Injectable()
export class BlogPostService {
  constructor(
    private readonly factoryTypeFactory: FactoryTypeFactory,
    private readonly repositoriesTypeFactory: RepositoryTypeFactory,
    private readonly blogTagService: BlogTagService,
    private readonly commonPostRepository: CommonPostRepository,
    private readonly blogCommentFactory: BlogCommentFactory,
    private readonly blogCommentRepository: BlogCommentRepository,
    private readonly commonPostFactory: CommonPostFactory
  ) {}

  public async createPost(dto: CreatePostDto) {
    const postFactory = this.factoryTypeFactory.create(dto.type)
    const postRepository = this.repositoriesTypeFactory.create(dto.type)

    const tags = await this.blogTagService.getTagsByIds(dto.tags)
    const newPost = postFactory.createFromCreatePostDto(dto, tags)
    await postRepository.save(newPost)
    return await this.commonPostRepository.findById(newPost.id)
  }

  public async getPost(id: string): Promise<CommonPostEntity> {
    return await this.commonPostRepository.findById(id)
  }

  public async getAllPosts(query?: BlogPostQuery): Promise<PaginationResult<CommonPostEntity>> {
    return await this.commonPostRepository.findAll(query)
  }

  public async deleteCategory(id: string): Promise<void> {
    try {
      await this.commonPostRepository.deleteById(id)
    } catch {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }
  }

  public async updatePost(id: string, dto: UpdatePostDto): Promise<BasePostEntity> {
    const existsPost = await this.commonPostRepository.findById(id)
    let tags: BlogTagEntity[] = []
    if (dto.tags) {
      tags = await this.blogTagService.getTagsByIds(dto.tags)
    }

    const updatedPost: IPost = {
      ...existsPost.toPOJO(),
      ...dto,
      tags: tags
    }
    const updatedEntity = this.commonPostFactory.create(updatedPost)
    await this.commonPostRepository.update(updatedEntity)
    return updatedEntity
  }

  public async addComment(postId: string, dto: CreateCommentDto): Promise<BlogCommentEntity> {
    const { id } = await this.getPost(postId)
    const newComment = this.blogCommentFactory.createFromDto(dto, id as string)
    await this.blogCommentRepository.save(newComment)

    return newComment
  }
}
