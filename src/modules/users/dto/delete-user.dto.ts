import { IsBoolean, IsMongoId } from 'class-validator';

export class DeleteUserDto {
  @IsMongoId()
  readonly userId: string;

  @IsBoolean()
  isAdmin: boolean;
}
