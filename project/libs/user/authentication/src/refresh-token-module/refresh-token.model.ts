import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

import { IJwtToken } from '@project/shared/core'

@Schema({
  collection: 'refresh-sessions',
  timestamps: true
})
export class RefreshTokenModel extends Document implements IJwtToken {
  @Prop()
  public createdAt: Date

  @Prop({ required: true })
  public tokenId: string

  @Prop({ required: true })
  public userId: string

  @Prop({ required: true })
  public expiresIn: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenModel)
