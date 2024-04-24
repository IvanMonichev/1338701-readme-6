import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'
import {
  ApiDescription,
  AuthenticationValidateMessage
} from 'libs/user/authentication/src/authentication-module/authentication.constant'

export class LoginUserDto {
  @ApiProperty({
    description: ApiDescription.EMAIL,
    example: 'String'
  })
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  public email: string

  @ApiProperty({
    description: ApiDescription.PASSWORD,
    example: 'String'
  })
  @IsString()
  public password: string
}
