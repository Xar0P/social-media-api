import { IsMongoId } from 'class-validator';

export class CurrentUserDto {
  @IsMongoId()
  readonly userId: string;
}
