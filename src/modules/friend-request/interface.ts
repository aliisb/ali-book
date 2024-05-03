// file imports
import { MongoID } from '../../configs/types';

export interface IFriendRequest {
  // userId?: MongoID;
  sender: MongoID;
  receiver: string;
}
