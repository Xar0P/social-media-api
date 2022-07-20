import { Document } from 'mongoose';

export class Post extends Document {
  userId: string;
  desc: string;
  img: string;
  likes: Array<string>;
}
