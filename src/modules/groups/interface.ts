// file imports
import { MongoID } from '../../configs/types';

export interface Element {
  _id?: MongoID;
  title: string;
  admin?: MongoID;
  moderator?: MongoID;
  members?: MongoID;
}
