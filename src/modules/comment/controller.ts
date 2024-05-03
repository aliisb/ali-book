import mongoose, { isValidObjectId } from 'mongoose';

import CommentModel from './model';
import PostModel from '../posts/model';
import { IComment } from './interface';
import { ErrorHandler } from '../../middlewares/error-handler';
import { GetCommentsDTO } from './dto';

export const addComment = async (commentObj: IComment) => {
  const postId = commentObj.post;
  const result = await CommentModel.create(commentObj);
  await PostModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
  return result;
};

export const updateCommentById = async (
  comment: string,
  commentObj: Partial<IComment>
) => {
  if (!comment) throw new ErrorHandler('Please enter comment id!', 404);
  if (!isValidObjectId(comment))
    throw new ErrorHandler('Please enter valid comment id!', 404);
  const commentExists = await CommentModel.findByIdAndUpdate(
    comment,
    commentObj,
    { new: true }
  );
  if (!commentExists) throw new ErrorHandler('comment not found!', 404);
  return commentExists;
};

export const deleteComment = async (comment: string) => {
  if (!comment) throw new ErrorHandler('Please enter comment id!', 404);
  if (!isValidObjectId(comment))
    throw new ErrorHandler('Please enter valid comment id!404');
  const commentExists = await CommentModel.findByIdAndDelete(comment);
  if (!commentExists) throw new ErrorHandler('comment not found!', 404);
  return commentExists;
};

export const getComment = async (comment: string) => {
  if (!comment) throw new ErrorHandler('Please enter comment id!', 404);
  if (!isValidObjectId(comment))
    throw new ErrorHandler('Please enter valid comment id!404');
  const commentExists = await CommentModel.findById(comment).select(
    '-createdAt -updatedAt -__v'
  );
  if (!commentExists) throw new ErrorHandler('comment not found!|||', 404);
  return commentExists;
};

export const getComments = async (params: GetCommentsDTO) => {
  let { limit, page, post } = params;
  const postId = new mongoose.Types.ObjectId(post);
  page = page - 1 || 0;
  limit = limit || 10;
  const query = { post: postId };
  const [result] = await CommentModel.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userdetail',
      },
    },
    {
      $unwind: '$userdetail',
    },
    {
      $project: {
        _id: 1,
        username: '$userdetail.name',
        image: '$userdetail.image',
        content: 1,
        post: 1,
      },
    },
    {
      $facet: {
        totalCount: [{ $count: 'totalCount' }],
        data: [{ $skip: page * limit }, { $limit: limit }],
      },
    },
    { $unwind: '$totalCount' },
    {
      $project: {
        totalCount: '$totalCount.totalCount',
        totalPages: { $ceil: { $divide: ['$totalCount.totalCount', limit] } },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...result };
};
