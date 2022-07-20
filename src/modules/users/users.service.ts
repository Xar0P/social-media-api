import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CurrentUserDto, DeleteUserDto, UpdateUserDto } from './dto';
import { User } from './interfaces/user';
import { HandleErrors } from '../../utils/errors/handleErrors.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly errors: HandleErrors,
  ) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (id === updateUserDto.userId || updateUserDto.isAdmin) {
      if (updateUserDto.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          updateUserDto.password = await bcrypt.hash(
            updateUserDto.password,
            salt,
          );
        } catch (error) {
          this.errors.handleHttpExceptions(error);
        }
      }
      try {
        const user = await this.userModel.findByIdAndUpdate(id, {
          $set: updateUserDto,
        });
        return user;
      } catch (error) {
        this.errors.handleHttpExceptions(error);
      }
    } else {
      throw new HttpException(
        'Você só pode atualizar as informações da sua conta!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async delete(id: string, deleteUserDto: DeleteUserDto) {
    if (id === deleteUserDto.userId || deleteUserDto.isAdmin) {
      try {
        const user = await this.userModel.deleteOne({ _id: id });
        if (user.deletedCount === 0)
          throw new HttpException(
            'Essa conta já foi deletada!',
            HttpStatus.NOT_MODIFIED,
          );
        return user;
      } catch (error) {
        this.errors.handleHttpExceptions(error);
      }
    } else {
      throw new HttpException(
        'Você só pode deletar as informações da sua conta!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user: any = await this.userModel.findById(id);
      if (!user)
        throw new HttpException('Usuário não existe', HttpStatus.NOT_FOUND);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, updatedAt, ...other } = user._doc;
      return other;
    } catch (error) {
      this.errors.handleHttpExceptions(error);
    }
  }

  async followUser(id: string, currentUserDto: CurrentUserDto) {
    if (id !== currentUserDto.userId) {
      try {
        const user: any = await this.userModel.findById(id);
        const currentUser: any = await this.userModel.findById(
          currentUserDto.userId,
        );
        if (!user || !currentUser)
          throw new HttpException(
            'Um dos usuários não existe!',
            HttpStatus.NOT_FOUND,
          );

        if (!user.followers.includes(currentUserDto.userId)) {
          await user.updateOne({ $push: { followers: currentUserDto.userId } });
          await currentUser.updateOne({ $push: { followings: id } });
          return { statusCode: 200, message: 'Usuário seguido com sucesso!' };
        } else {
          throw new HttpException(
            'Você já segue esse usuário!',
            HttpStatus.FORBIDDEN,
          );
        }
      } catch (error) {
        this.errors.handleHttpExceptions(error);
      }
    } else {
      throw new HttpException(
        'Você não pode seguir você mesmo!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async unfollowUser(id: string, currentUserDto: CurrentUserDto) {
    if (id !== currentUserDto.userId) {
      try {
        const user: any = await this.userModel.findById(id);
        const currentUser: any = await this.userModel.findById(
          currentUserDto.userId,
        );
        if (!user || !currentUser)
          throw new HttpException(
            'Um dos usuários não existe!',
            HttpStatus.NOT_FOUND,
          );

        if (user.followers.includes(currentUserDto.userId)) {
          await user.updateOne({ $pull: { followers: currentUserDto.userId } });
          await currentUser.updateOne({ $pull: { followings: id } });
          return {
            statusCode: 200,
            message: 'Você parou de seguir esse usuário com sucesso!',
          };
        } else {
          throw new HttpException(
            'Você já não segue esse usuário!',
            HttpStatus.FORBIDDEN,
          );
        }
      } catch (error) {
        this.errors.handleHttpExceptions(error);
      }
    } else {
      throw new HttpException(
        'Você não pode parar de seguir você mesmo!',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
