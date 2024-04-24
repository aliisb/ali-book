// module imports

// file imports
import HelperModel from './model';
import { Element } from './interface';
import { ErrorHandler } from '../../middlewares/error-handler';

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addHelper = async (elementObj: Element) => {
  return await HelperModel.create(elementObj);
};

/**
 * @description Check element existence
 * @param {Object} query element data
 * @returns {Boolean} element existence status
 */
export const checkHelperExistence = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler('Please enter query!', 400);
  return await HelperModel.exists(query);
};
