import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UsersModule } from 'src/users/users.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'src/database/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormconfig,
      autoLoadEntities: true, // models will be loaded automatically
    }),
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
