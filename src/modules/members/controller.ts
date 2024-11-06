// module imports
import { isValidObjectId } from 'mongoose';

// file imports
import MemberModel from './model';
import User from '../user/model';
import Group from '../groups/model';
import { IMember } from './interface';
import { MongoID } from '../../configs/types';
import { ErrorHandler } from '../../middlewares/error-handler';

export const joinRequest = async (params: IMember) => {
  const { userId, groupId } = params;
  // Check if the user and group exist
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new ErrorHandler('user does not exist');
  }

  const groupExists = await Group.findById(groupId);
  if (!groupExists) {
    throw new ErrorHandler('group does not exist');
  }

  // Check if a request already exists between the user and group
  const existingRequest = await MemberModel.findOne({
    user: userId,
    group: groupId,
  });

  if (existingRequest) {
    throw new ErrorHandler('Join request already sent');
  }

  // Create a new friend request
  const newRequest = await MemberModel.create({
    user: userId,
    group: groupId,
  });

  await newRequest.save();
  return newRequest;
};

export const getJoinRequestById = async (groupId: MongoID) => {
  const groupExists = await Group.findById(groupId);
  if (!groupExists) throw new ErrorHandler('Please enter group id!', 400);
  if (!isValidObjectId(groupId))
    throw new ErrorHandler('Please enter valid user id!', 400);
  const joinRequestExists = await MemberModel.find({ group: groupId });
  if (!joinRequestExists)
    throw new ErrorHandler('Join request not found!', 404);
  return joinRequestExists;
};

export const updateJoinRequestById = async (
  joinRequest: MongoID,
  joinRequestObj: Partial<IMember>
) => {
  if (!joinRequest)
    throw new ErrorHandler('Please enter join request id!', 400);
  if (!isValidObjectId(joinRequest))
    throw new ErrorHandler('Please enter valid join request id!', 400);
  const joinRequestExists = await MemberModel.findByIdAndUpdate(
    joinRequest,
    joinRequestObj,
    { new: true }
  );
  if (!joinRequestExists)
    throw new ErrorHandler('join request not found!', 404);
  return joinRequestExists;
};
