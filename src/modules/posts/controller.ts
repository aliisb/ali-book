// module imports
import { isValidObjectId } from 'mongoose';

// file imports
import PostModel from './model';
import { IPost } from './interface';
import { GetPostsDTO } from './dto';
import { MongoID } from '../../configs/types';
import { ErrorHandler } from '../../middlewares/error-handler';

// destructuring assignments

// variable initializations

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addPost = async (params: IPost) => {
  const { user } = params;
  return await PostModel.create(params);
};

/**
 * @description Update element data
 * @param {String} element element id
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updatePostById = async (
  element: MongoID,
  elementObj: Partial<IPost>
) => {
  if (!element) throw new ErrorHandler('Please enter element id!', 400);
  if (!isValidObjectId(element))
    throw new ErrorHandler('Please enter valid element id!', 400);
  const elementExists = await PostModel.findByIdAndUpdate(element, elementObj, {
    new: true,
  });
  if (!elementExists) throw new ErrorHandler('element not found!', 404);
  return elementExists;
};

/**
 * @description Update element data
 * @param {Object} query element data
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updatePost = async (
  query: Partial<Element>,
  elementObj: Partial<Element>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler('Please enter query!', 400);
  const elementExists = await PostModel.findOneAndUpdate(query, elementObj, {
    new: true,
  });
  if (!elementExists) throw new ErrorHandler('element not found!', 404);
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const deletePostById = async (element: MongoID) => {
  if (!element) throw new ErrorHandler('Please enter element id!', 400);
  if (!isValidObjectId(element))
    throw new ErrorHandler('Please enter valid element id!', 400);
  const elementExists = await PostModel.findByIdAndDelete(element);
  if (!elementExists) throw new ErrorHandler('element not found!', 404);
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} query element data
 * @returns {Object} element data
 */
export const deletePost = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler('Please enter query!', 400);
  const elementExists = await PostModel.findOneAndDelete(query);
  if (!elementExists) throw new ErrorHandler('element not found!', 404);
  return elementExists;
};

/**
 * @description Get element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const getPostById = async (element: MongoID) => {
  if (!element) throw new ErrorHandler('Please enter element id!', 400);
  if (!isValidObjectId(element))
    throw new ErrorHandler('Please enter valid element id!', 400);
  const elementExists = await PostModel.findById(element).select(
    '-createdAt -updatedAt -__v'
  );
  if (!elementExists) throw new ErrorHandler('element not found!', 404);
  return elementExists;
};

/**
 * @description Get element
 * @param {Object} query element data
 * @returns {Object} element data
 */
export const getPost = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler('Please enter query!', 400);
  const elementExists = await PostModel.findOne(query).select(
    '-createdAt -updatedAt -__v'
  );
  if (!elementExists) throw new ErrorHandler('element not found!', 404);
  return elementExists;
};

/**
 * @description Get elements
 * @param {Object} params elements fetching parameters
 * @returns {Object[]} elements data
 */
export const getPosts = async (params: GetPostsDTO) => {
  let { limit, page } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  const [result] = await PostModel.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
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

/**
 * @description Check element existence
 * @param {Object} query element data
 * @returns {Boolean} element existence status
 */
export const checkPostExistence = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler('Please enter query!', 400);
  return await PostModel.exists(query);
};

/**
 * @description Count elements
 * @param {Object} query element data
 * @returns {Number} elements count
 */
export const countPosts = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler('Please enter query!', 400);
  return await PostModel.countDocuments(query);
};
