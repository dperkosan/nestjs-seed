import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class CreateUserWithOrganizationDto extends OmitType(CreateUserDto, [
  'organizationId',
]) {}
