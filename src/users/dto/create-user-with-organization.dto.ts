import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class CreateUserWithOrganizationtDto extends OmitType(CreateUserDto, [
  'organizationId',
]) {}
