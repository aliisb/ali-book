// file imports
import { MEMBERSHIP_STATUS } from '../../configs/enum';
import { MongoID } from '../../configs/types';

export interface IMember {
  userId: MongoID;
  groupId: MongoID;
  status?: MEMBERSHIP_STATUS;
}
