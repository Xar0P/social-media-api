import { IsMongoId } from 'class-validator';

export class UserDto {
  @IsMongoId()
  userId: string;
}
