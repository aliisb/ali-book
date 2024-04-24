// file imports
import { MongoID } from '../../configs/types';
import { USER_STATUSES, USER_TYPES, GENDER } from '../../configs/enum';

export interface User {
  _id?: MongoID;
  email: string;
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  gender?: GENDER;
  DOB?: string;
  name?: string;
  image?: string;
  fcms?: { token: string; device: string }[];
  location?: { type?: string; coordinates?: number[] };
  type: USER_TYPES;
  status?: USER_STATUSES;
  isOnline?: boolean;
  helper?: MongoID;
  googleId?: string;
  facebookId?: string;
  lastLogin?: Date;
  otp?: string;
}
