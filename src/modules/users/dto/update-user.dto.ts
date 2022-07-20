import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsMongoId()
  readonly userId: string;

  @IsString()
  @IsOptional()
  @Min(3)
  @MaxLength(20)
  username: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsOptional()
  @Min(6)
  password: string;

  @IsString()
  @IsOptional()
  profilePicture: string;

  @IsString()
  @IsOptional()
  coverPicture: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  desc: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  city: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  from: string;

  @IsEnum([1, 2, 3])
  @IsOptional()
  relationship: number;
}
