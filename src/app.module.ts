import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryFailedExceptionFilter } from './common/filters/query-failed-exception/query-failed-exception.filter';
import { typeOrmModuleOptions } from './database/config/typeorm.config';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...typeOrmModuleOptions,
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
          // transform primitive types (string) into expected ones in dto files
          // can impact performance
          transform: true,
          transformOptions: {
            // with this, there is no need for: @Type(() => Number)
            enableImplicitConversion: true,
          },
        }),
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedExceptionFilter,
    },
  ],
})
export class AppModule {}
