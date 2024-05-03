import postModel from '../posts/model';
import pageModel from '../pages/model';
import LikeModel from './model';
import { ILike } from './interface';

export const addLike = async (likeObj: ILike) => {
  const { user, post, page } = likeObj;
  const likeExist = await LikeModel.findOne({ user, post });
  if (likeExist) {
    throw new Error('You have already liked this item|||400');
  }
  if (post) {
    await postModel.findByIdAndUpdate(post, { $inc: { likescount: 1 } });
  }
  if (page) {
    await pageModel.findByIdAndUpdate(page, { $inc: { likescount: 1 } });
  }
  return LikeModel.create(likeObj);
};

export const deleteLike = async (params: ILike) => {
  const { user, post } = params;
  const result = await LikeModel.deleteOne({ user: user, post: post });
  if (result.deletedCount === 1) {
    await postModel.findByIdAndUpdate(post, { $inc: { likescount: -1 } });
  }
  if (result.deletedCount === 0) {
    return {
      success: false,
      message: 'Like not found for the given user and post',
    };
  }
  return result;
};
