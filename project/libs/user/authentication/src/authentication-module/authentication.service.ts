import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { BlogUserRepository } from '@project/blog-user'
import { jwtConfig } from '@project/config'
import { IAuthUser, IToken } from '@project/shared/core'
import { createJWTPayload } from '@project/shared/helpers'
import { IHasher } from 'libs/shared/helpers/src/hasher/hasher.interface'
import { ApiResponseDescription } from 'libs/user/authentication/src/authentication-module/authentication.constant'
import { CreateUserDto } from 'libs/user/authentication/src/authentication-module/dto/create-user.dto'
import { LoginUserDto } from 'libs/user/authentication/src/authentication-module/dto/login-user.dto'
import { RefreshTokenService } from 'libs/user/authentication/src/refresh-token-module/refresh-token.service'
import { BlogUserEntity } from 'libs/user/blog-user/src/blog-user-module/blog-user.entity'
import { randomUUID } from 'node:crypto'

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name)

  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    @Inject('Hasher') private readonly hasher: IHasher,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>
  ) {}

  public async register(dto: CreateUserDto): Promise<BlogUserEntity> {
    const { email, username, password, avatarId } = dto

    const blogUser: IAuthUser = {
      email,
      username,
      avatarId
    }

    const existUser = await this.blogUserRepository.findByEmail(email)

    if (existUser) {
      throw new ConflictException(ApiResponseDescription.UserExists)
    }

    const passwordHash = await this.hasher.hash(password)
    const userEntity = await new BlogUserEntity(blogUser).setPassword(passwordHash)
    await this.blogUserRepository.save(userEntity)
    return userEntity
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto
    const existUser = await this.blogUserRepository.findByEmail(email)

    if (!existUser) {
      throw new NotFoundException(ApiResponseDescription.UserNotFound)
    }
    const isCorrectPassword = existUser.passwordHash
      ? await this.hasher.compareHash(password, existUser.passwordHash)
      : false

    if (!isCorrectPassword) {
      throw new UnauthorizedException(ApiResponseDescription.PasswordWrong)
    }

    return existUser
  }

  public async createUserToken(user: BlogUserEntity): Promise<IToken> {
    const accessTokenPayload = createJWTPayload(user)
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: randomUUID() }
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload)

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload)
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      })

      return { accessToken, refreshToken }
    } catch (e) {
      const error = e as { message: string }
      this.logger.error('[Token generation error]: ' + error.message)
      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async getUserByEmail(email: string) {
    const existUser = await this.blogUserRepository.findByEmail(email)

    if (!existUser) {
      throw new NotFoundException(`User with email ${email} not found`)
    }

    return existUser
  }

  public async getUser(id: string): Promise<BlogUserEntity> {
    const existUser = await this.blogUserRepository.findById(id)
    if (!existUser) {
      throw new NotFoundException('User not found')
    }

    return existUser
  }

  public async changePassword(currentPassword: string, newPassword: string, userId?: string): Promise<void> {
    if (!userId) {
      throw new BadRequestException('User not defined')
    }
    const user = await this.getUser(userId)
    if (!user.passwordHash) {
      return
    }

    const isCorrectPassword = await this.hasher.compareHash(currentPassword, user.passwordHash)

    if (!isCorrectPassword) {
      throw new UnauthorizedException(ApiResponseDescription.PasswordWrong)
    }

    const newPasswordHash = await this.hasher.hash(newPassword)
    const newUserEntity = await user.setPassword(newPasswordHash)
    console.log(newUserEntity)

    await this.blogUserRepository.update(newUserEntity)
  }
}
