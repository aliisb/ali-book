import { MongoID } from '../../configs/types';

export interface IFollow {
  _id?: MongoID;
  follower: MongoID;
  following: MongoID;
}
