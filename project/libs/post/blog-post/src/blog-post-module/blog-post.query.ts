import { PostStatus, PostType, SortDirection } from '@project/shared/core'
import { Transform } from 'class-transformer'
import { IsArray, IsIn, IsNumber, IsOptional, IsUUID } from 'class-validator'
import { SortField } from 'libs/shared/core/src/enums/sort-field.enum'

import {
  DEFAULT_PAGE_COUNT,
  DEFAULT_POST_COUNT_LIMIT,
  DEFAULT_SORT_BY_FIELD,
  DEFAULT_SORT_DIRECTION
} from './blog-post.constant'

export class BlogPostQuery {
  @Transform(({ value }) => +value || DEFAULT_POST_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit? = DEFAULT_POST_COUNT_LIMIT

  @IsUUID('all', { each: true })
  @IsArray()
  @IsOptional()
  public tags?: string[]

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection?: SortDirection = DEFAULT_SORT_DIRECTION

  @Transform(({ value }) => +value || DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page?: number = DEFAULT_PAGE_COUNT

  @IsOptional()
  public sortByField?: SortField = DEFAULT_SORT_BY_FIELD

  @IsOptional()
  public filterByType?: PostType

  @IsOptional()
  public filterByStatus?: PostStatus = PostStatus.Published
}
