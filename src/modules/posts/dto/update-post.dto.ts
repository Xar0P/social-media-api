import { IsString, IsMongoId, MaxLength, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsMongoId()
  userId: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  desc: string;

  @IsString()
  @IsOptional()
  img: string;
}
