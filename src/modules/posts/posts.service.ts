import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HandleErrors } from 'src/utils/errors/handleErrors.util';
import { User } from '../users/interfaces/user';
import { CreatePostDto, UpdatePostDto, UserDto } from './dto';
import { Post } from './interfaces/post';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly errors: HandleErrors,
  ) {}

  async createPost(createPost: CreatePostDto) {
    const newPost = new this.postModel(createPost);
    try {
      const savedPost = await newPost.save();
      return { message: 'Post criado', post: savedPost };
    } catch (error) {
      this.errors.handleHttpExceptions(error);
    }
  }

  async updatePost(id: string, updatePost: UpdatePostDto) {
    try {
      const post: any = await this.postModel.findById(id);
      if (post.userId === updatePost.userId) {
        await post.updateOne({ $set: updatePost });
        return { message: 'Post atualizado com sucesso' };
      } else {
        throw new HttpException(
          'Você só pode atualizar os seus posts',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      this.errors.handleHttpExceptions(error);
    }
  }

  async deletePost(id: string, deletePost: UserDto) {
    try {
      const post: any = await this.postModel.findById(id);
      if (post.userId === deletePost.userId) {
        await post.deleteOne();
        return { message: 'Post deletado com sucesso' };
      } else {
        throw new HttpException(
          'Você só pode deletar os seus posts',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      this.errors.handleHttpExceptions(error);
    }
  }

  async likePost(id: string, likePost: UserDto) {
    try {
      const post = await this.postModel.findById(id);
      if (!post.likes.includes(likePost.userId)) {
        await post.updateOne({ $push: { likes: likePost.userId } });
        return { message: 'Post foi curtido' };
      } else {
        await post.updateOne({ $pull: { likes: likePost.userId } });
        return { message: 'Post foi descurtido' };
      }
    } catch (error) {
      this.errors.handleHttpExceptions(error);
    }
  }

  async getPost(id: string) {
    try {
      const post = await this.postModel.findById(id);
      return { post };
    } catch (error) {
      this.errors.handleHttpExceptions(error);
    }
  }

  async getTimeline(user: UserDto) {
    try {
      const currentUser = await this.userModel.findById(user.userId);
      const userPosts = await this.postModel.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId: string) => {
          return this.postModel.find({ userId: friendId });
        }),
      );
      return userPosts.concat(...friendPosts);
    } catch (error) {
      this.errors.handleHttpExceptions(error);
    }
  }
}
