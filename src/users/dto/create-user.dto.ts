import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Organization } from 'src/organizations/entities/organization.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly organizationId: Organization['id'];
}
