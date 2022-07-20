import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../users/interfaces/user';
import { CreateUserDto, LoginUserDto } from './dto/';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create({ username, email, password }: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = new this.userModel({
        username,
        email,
        password: hashedPassword,
      });
      return await createdUser.save();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      throw new HttpException('Senha incorreta', HttpStatus.NOT_ACCEPTABLE);

    return user;
  }
}
