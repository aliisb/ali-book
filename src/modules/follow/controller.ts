import mongoose, { isValidObjectId } from 'mongoose';
import userModel from '../user/model';

import FollowModel from './model';
import { IFollow } from './interface';
import { GetfollowDTO } from './dto';
import { ErrorHandler } from '../../middlewares/error-handler';

export const addFollow = async (params: IFollow) => {
  const { following, follower } = params;
  if (follower == following) {
    throw new ErrorHandler('can not follow user himself|||', 400);
  }
  const existingFollow = await FollowModel.findOne({
    follower: follower,
    following: following,
  });

  if (!existingFollow) {
    const newFollow = await FollowModel.create({
      follower: follower,
      following: following,
    });

    await userModel.findByIdAndUpdate(
      following,
      { $inc: { followers: 1 } },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      follower,
      { $inc: { following: 1 } },
      { new: true }
    );

    return newFollow;
  }

  return { message: 'Already following this user' };
};

export const deleteFollow = async (params: IFollow) => {
  const { following, follower } = params;

  const existingFollow = await FollowModel.findOneAndDelete({
    follower: new mongoose.Types.ObjectId(follower),
    following: new mongoose.Types.ObjectId(following),
  });

  if (!existingFollow) {
    return { message: 'Not following this user' };
  }

  await userModel.findByIdAndUpdate(
    following,
    { $inc: { followers: -1 } },
    { new: true }
  );

  await userModel.findByIdAndUpdate(
    follower,
    { $inc: { following: -1 } },
    { new: true }
  );

  return existingFollow;
};

export const getMyFollowers = async (params: GetfollowDTO) => {
  let { page, limit, userId } = params;

  page = page - 1 || 0;
  limit = limit || 10;

  const followers = await FollowModel.aggregate([
    {
      $match: { following: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'follower',
        foreignField: '_id',
        as: 'followerInfo',
      },
    },
    {
      $unwind: '$followerInfo',
    },
    {
      $project: {
        _id: '$followerInfo._id',
        email: '$followerInfo.email',
        name: '$followerInfo.name',
      },
    },
  ]);

  if (!followers) throw new ErrorHandler('Error while fetching followers');

  return followers;
};

export const getMyFollowing = async (params: GetfollowDTO) => {
  let { page, limit, userId } = params;

  page = page - 1 || 0;
  limit = limit || 10;

  const following = await FollowModel.aggregate([
    {
      $match: { follower: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'following',
        foreignField: '_id',
        as: 'followingInfo',
      },
    },
    {
      $unwind: '$followingInfo',
    },
    {
      $project: {
        _id: '$followingInfo._id',
        email: '$followingInfo.email',
        name: '$followingInfo.name',
      },
    },
  ]);

  if (!following) throw new ErrorHandler('Error while fetching followers');

  return following;
};

export const getOtherUserFollowers = async (params: GetfollowDTO) => {
  let { page, limit, userId, otherUserId } = params;

  page = page - 1 || 0;
  limit = limit || 10;

  const followers = await FollowModel.aggregate([
    {
      $match: { following: new mongoose.Types.ObjectId(otherUserId) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'follower',
        foreignField: '_id',
        as: 'followerInfo',
      },
    },
    {
      $unwind: '$followerInfo',
    },
    {
      $project: {
        _id: '$followerInfo._id',
        email: '$followerInfo.email',
        name: '$followerInfo.name',
      },
    },
  ]);

  if (!followers) throw new ErrorHandler('Error while fetching followers');

  return followers;
};

export const getOtherUserFollowing = async (params: GetfollowDTO) => {
  let { page, limit, userId } = params;

  page = page - 1 || 0;
  limit = limit || 10;

  const following = await FollowModel.aggregate([
    {
      $match: { follower: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'following',
        foreignField: '_id',
        as: 'followingInfo',
      },
    },
    {
      $unwind: '$followingInfo',
    },
    {
      $project: {
        _id: '$followingInfo._id',
        email: '$followingInfo.email',
        name: '$followingInfo.name',
      },
    },
  ]);

  if (!following) throw new ErrorHandler('Error while fetching followers');

  return following;
};
