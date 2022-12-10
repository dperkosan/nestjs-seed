import { Module } from '@nestjs/common';
import { OrganizationsController } from 'src/organizations/organizations.controller';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Organization } from 'src/organizations/entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
