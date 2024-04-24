// module imports
import express, { Request, Response } from 'express';

// file imports
import * as postController from './controller';
import { exceptionHandler } from '../../middlewares/exception-handler';
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from '../../middlewares/authenticator';
import { IRequest } from '../../configs/types';

// destructuring assignments

// variable initializations
const router = express.Router();

router.get(
  '/postID',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    let { postID } = req.params;
    postID = postID?.toString() || '';
    const args = {
      postID,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await postController.getPosts(args);
    res.json(response);
  })
);

router.post(
  '/',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { content } = req.body;
    const user = req.user._id;
    const args: any = { content, user };
    const response = await postController.addPost(args);
    res.json(response);
  })
);

router.put(
  '/:postID',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { postID } = req.params;
    const { content } = req.body;
    const args = { content };
    postID = postID?.toString() || '';
    const response = await postController.updatePostById(postID, args);
    res.json(response);
  })
);

router.delete(
  '/:postID',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { postID } = req.params;
    postID = postID?.toString() || '';
    const response = await postController.deletePostById(postID);
    res.json(response);
  })
);

router.get(
  '/:element',
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const { element } = req.params;
    const response = await postController.getPostById(element);
    res.json(response);
  })
);

export default router;
