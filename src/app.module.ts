import * as Joi from '@hapi/joi';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './database/config/typeorm.config';
import { nodeEnvAllowedValues } from './database/config/typeorm.config';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(...nodeEnvAllowedValues)
          .default('development'),
        DB_HOST: Joi.required(),
        DB_NAME: Joi.required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.required(),
        DB_PASSWORD: Joi.required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOptions,
        autoLoadEntities: true, // every entity registered through the forFeature() method will be automatically added to the entities array
      }),
    }),
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
        }),
    },
  ],
})
export class AppModule {}
