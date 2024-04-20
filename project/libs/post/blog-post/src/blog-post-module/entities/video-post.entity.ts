import { IPost, IPostVideo, StorableEntity } from '@project/shared/core'
import { BasePostEntity } from 'libs/post/blog-post/src/blog-post-module/entities/base-post.entity'

export class VideoPostEntity extends BasePostEntity implements StorableEntity<IPost> {
  public postVideo?: IPostVideo

  constructor(post?: IPost) {
    super(post)
    if (post) {
      this.postVideo = post.postVideo
    }
  }

  toPOJO(): IPost {
    return {
      ...super.toPOJO(),
      postVideo: this.postVideo
    }
  }
}
