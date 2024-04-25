// file imports
import { MongoID } from '../../configs/types';

export interface IPost {
  user: MongoID;
  content: string;
  media: string;
  _id?: string;
}
