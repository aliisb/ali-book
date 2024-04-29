import { MongoID } from '../../configs/types';

export interface ILike {
  user: MongoID;
  post?: MongoID;
  page?: MongoID;
}
