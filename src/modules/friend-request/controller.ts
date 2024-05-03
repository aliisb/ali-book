// module imports
import { isValidObjectId } from 'mongoose';

// file imports
import FriendRequestModel from './model';
import User from '../user/model';
import { IFriendRequest } from './interface';
import { MongoID } from '../../configs/types';
import { ErrorHandler } from '../../middlewares/error-handler';

// destructuring assignments

// variable initializations

/**
 * @description Add friendrequest
 * @param {Object} friendrequestObj friendrequest data
 * @returns {Object} friendrequest data
 */
export const createRequest = async (params: IFriendRequest) => {
  const { sender, receiver } = params;
  // Check if the sender and receiver exist
  const senderExists = await User.findById(sender);
  if (!senderExists) {
    throw new Error('Sender does not exist');
  }

  const receiverExists = await User.findById(receiver);
  if (!receiverExists) {
    throw new Error('Receiver does not exist');
  }

  // Check if a friend request already exists between the sender and receiver
  const existingRequest = await FriendRequestModel.findOne({
    sender: sender,
    receiver: receiver,
  });

  if (existingRequest) {
    throw new Error('Friend request already sent');
  }

  // Create a new friend request
  const newFriendRequest = await FriendRequestModel.create({
    sender: sender,
    receiver: receiver,
  });

  await newFriendRequest.save();
  return newFriendRequest;
};

export const getfriendrequestById = async (userId: MongoID) => {
  const receiverExists = await User.findById(userId);
  if (!receiverExists) throw new ErrorHandler('Please enter user id!', 400);
  if (!isValidObjectId(userId))
    throw new ErrorHandler('Please enter valid user id!', 400);

  const friendrequestExists = await FriendRequestModel.find({
    receiver: userId,
  });
  if (!friendrequestExists)
    throw new ErrorHandler('friendrequest not found!', 404);
  return friendrequestExists;
};

export const updatefriendrequestById = async (
  friendrequest: MongoID,
  args: Partial<IFriendRequest>
) => {
  const friendrequestObj = args;
  // console.log(friendrequestObj);
  if (!friendrequest)
    throw new ErrorHandler('Please enter friendrequest id!', 400);
  if (!isValidObjectId(friendrequest))
    throw new ErrorHandler('Please enter valid friendrequest id!', 400);
  const friendrequestExists = await FriendRequestModel.findByIdAndUpdate(
    friendrequest,
    friendrequestObj,
    { new: true }
  );
  if (!friendrequestExists)
    throw new ErrorHandler('friendrequest not found!', 404);
  return friendrequestExists;
};
