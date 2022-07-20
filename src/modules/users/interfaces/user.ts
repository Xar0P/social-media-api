import { Document } from 'mongoose';

export class User extends Document {
  id: number;
  username: string;
  email: string;
  password: string;
  followings: Array<string>;
}
