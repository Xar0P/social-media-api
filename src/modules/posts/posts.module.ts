import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HandleErrors } from 'src/utils/errors/handleErrors.util';
import { UserSchema } from '../users/user.schema';
import { PostSchema } from './post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, HandleErrors],
})
export class PostsModule {}
