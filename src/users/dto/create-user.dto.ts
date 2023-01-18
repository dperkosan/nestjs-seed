import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Organization } from 'src/organizations/entities/organization.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly organizationId: Organization['id'];
}
