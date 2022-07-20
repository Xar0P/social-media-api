import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '../users/interfaces/user';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.authService.create(user);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: LoginUserDto): Promise<User> {
    return this.authService.login(user);
  }
}
