import { Module } from '@nestjs/common';
import { OrganizationsController } from 'src/organizations/organizations.controller';

@Module({ controllers: [OrganizationsController] })
export class OrganizationsModule {}
