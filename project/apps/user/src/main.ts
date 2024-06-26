/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const configService = app.get(ConfigService)
  const port = configService.get('application.port')

  const config = new DocumentBuilder().setTitle('User Service').setVersion('1.0.0').build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(globalPrefix, app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  await app.listen(port)
  Logger.log(`🚀 Application User is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
