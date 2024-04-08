import { ConfigService } from '@nestjs/config'
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'
import { getMongoConnectionString } from '@project/shared/helpers'

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      console.log({
        uri: getMongoConnectionString({
          username: config.get<string>('db.user') as string,
          password: config.get<string>('db.password') as string,
          host: config.get<string>('db.host') as string,
          port: config.get<string>('db.port') as string,
          authDatabase: config.get<string>('db.authBase') as string,
          databaseName: config.get<string>('db.name') as string
        })
      })
      return {
        uri: getMongoConnectionString({
          username: config.get<string>('db.user') as string,
          password: config.get<string>('db.password') as string,
          host: config.get<string>('db.host') as string,
          port: config.get<string>('db.port') as string,
          authDatabase: config.get<string>('db.authBase') as string,
          databaseName: config.get<string>('db.name') as string
        })
      }
    },
    inject: [ConfigService]
  }
}
