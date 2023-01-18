import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserWithOrganizationtDto } from 'src/users/dto/create-user-with-organization.dto';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserWithOrganizationtDto)
  readonly users: CreateUserWithOrganizationtDto[];
}
