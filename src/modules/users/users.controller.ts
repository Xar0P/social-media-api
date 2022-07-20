import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CurrentUserDto, DeleteUserDto, UpdateUserDto } from './dto';
import { User } from './interfaces/user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<any> {
    return this.usersService.delete(id, deleteUserDto);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<any> {
    return this.usersService.getUserById(id);
  }

  @Put('/:id/follow')
  async followUser(
    @Param('id') id: string,
    @Body() currentUserDto: CurrentUserDto,
  ) {
    return this.usersService.followUser(id, currentUserDto);
  }

  @Put('/:id/unfollow')
  async unfollowUser(
    @Param('id') id: string,
    @Body() currentUserDto: CurrentUserDto,
  ) {
    return this.usersService.unfollowUser(id, currentUserDto);
  }
}
