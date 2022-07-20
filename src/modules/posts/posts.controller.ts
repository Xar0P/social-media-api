import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto, UserDto } from './dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() createPost: CreatePostDto) {
    const response = await this.postsService.createPost(createPost);
    return { statusCode: HttpStatus.CREATED, ...response };
  }

  @Put('/:id')
  async updatePost(@Param('id') id: string, @Body() updatePost: UpdatePostDto) {
    const response = await this.postsService.updatePost(id, updatePost);
    return { statusCode: HttpStatus.OK, ...response };
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string, @Body() deletePost: UserDto) {
    const response = await this.postsService.deletePost(id, deletePost);
    return { statusCode: HttpStatus.OK, ...response };
  }

  @Patch('/:id/like')
  async likePost(@Param('id') id: string, @Body() likePost: UserDto) {
    const response = await this.postsService.likePost(id, likePost);
    return { statusCode: HttpStatus.OK, ...response };
  }

  @Get('/:id')
  async getPost(@Param('id') id: string) {
    const response = await this.postsService.getPost(id);
    return { statusCode: HttpStatus.OK, ...response };
  }

  @Get('/timeline/all')
  async getTimeline(@Body() user: UserDto) {
    const response = await this.postsService.getTimeline(user);
    return { statusCode: HttpStatus.OK, ...response };
  }
}
