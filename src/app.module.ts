import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbconfig from './database/config/db.config';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbconfig,
      autoLoadEntities: true, // every entity registered through the forFeature() method will be automatically added to the entities array
    }),
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
