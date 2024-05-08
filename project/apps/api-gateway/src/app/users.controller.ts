import { HttpService } from '@nestjs/axios'
import { Body, Controller, Post, Req, UseFilters } from '@nestjs/common'
import { ApplicationServiceURL } from 'apps/api-gateway/src/app/app.config'
import { AxiosExceptionFilter } from 'apps/api-gateway/src/app/filters/axios-exception.filter'
import { InternalAxiosRequestConfig } from 'axios'
import { LoginUserDto } from 'libs/user/authentication/src/authentication-module/dto/login-user.dto'

@Controller('users')
@UseFilters(AxiosExceptionFilter)
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(private readonly httpService: HttpService) {}

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/login`, loginUserDto)
    return data
  }

  @Post('refresh')
  public async refreshToken(@Req() req: InternalAxiosRequestConfig) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/refresh`, null, {
      headers: {
        Authorization: req.headers['authorization']
      }
    })

    return data
  }
}