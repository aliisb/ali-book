// module imports
import express, { Request, Response } from 'express';
import { IRequest } from '../../configs/types';
import postModel from '../posts/model';
// file imports
import * as commentController from './controller';
import { exceptionHandler } from '../../middlewares/exception-handler';
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from '../../middlewares/authenticator';

// variable initializations
const router = express.Router();

router.get(
  '/',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { page, limit } = req.query;
    let { keyword } = req.query;
    keyword = keyword?.toString() || '';
    const args = {
      keyword,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await commentController.getComments(args);
    res.json(response);
  })
);

router
  .route('/user')
  .all(verifyToken, verifyUser)
  .post(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const userId = req.user._id;
      const { content, postId } = req.body;
      const args: any = { post: postId, user: userId, content };
      const response = await commentController.addComment(args);
      res.json(response);
    })
  )
  .put(
    exceptionHandler(async (req: IRequest, res: Response) => {
      let { comment } = req.query;
      const { content } = req.body;
      const args = { content };
      comment = comment?.toString() || '';
      const response = await commentController.updateCommentById(comment, args);
      res.json(response);
    })
  )
  .get(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { page, limit } = req.query;
      let { post } = req.query;
      //   keyword = keyword?.toString() || "";
      const args = {
        post,
        limit: Number(limit),
        page: Number(page),
      };
      const response = await commentController.getComments(args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: IRequest, res: Response) => {
      let { comment } = req.query;
      comment = comment?.toString() || '';
      const response = await commentController.deleteComment(comment);
      res.json(response);
    })
  );

router.get(
  '/:comment',
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { comment } = req.params;
    const response = await commentController.getComment(comment);
    res.json(response);
  })
);

export default router;
