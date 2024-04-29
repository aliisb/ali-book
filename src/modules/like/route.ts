// module imports
import express, { Request, Response } from 'express';
import { IRequest } from '../../configs/types';
// file imports
import * as likeController from './controller';
import { exceptionHandler } from '../../middlewares/exception-handler';
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from '../../middlewares/authenticator';

const router = express.Router();

// router.get(
//   "/likes-post/:postId",
//   verifyToken,
//   verifyUser,
//   exceptionHandler(async (req: IRequest, res: Response) => {
//     const { page, limit } = req.query;
//     const { postId } = req.params;

//     const args = {
//       postId,
//       limit: Number(limit),
//       page: Number(page),
//     };
//     const response = await likeController.getLikesForPost(postId);
//     res.json(response);
//   }),
// );

//Post Likes
router.post(
  '/:postId',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const userId = req.user._id;
    const { postId } = req.params;
    const args = { user: userId, post: postId };
    const response = await likeController.addLike(args);
    res.json(response);
  })
);

//Page Likes
router.post(
  '/:pageId',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const userId = req.user._id;
    const { pageId } = req.params;
    const args = { user: userId, page: pageId };
    const response = await likeController.addLike(args);
    res.json(response);
  })
);

//Unlike Post
router.delete(
  '/:postId',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const userId = req.user._id;
    let { postId } = req.params;
    postId = postId?.toString() || '';
    const args = { user: userId, post: postId };
    const response = await likeController.deleteLike(args);
    res.json(response);
  })
);

//Unlike Page
router.delete(
  '/:pageId',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const userId = req.user._id;
    let { pageId } = req.params;
    pageId = pageId?.toString() || '';
    const args = { user: userId, page: pageId };
    const response = await likeController.deleteLike(args);
    res.json(response);
  })
);

export default router;
