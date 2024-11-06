// module imports
import express, { Request, Response } from 'express';

// file imports
import * as postController from './controller';
import { exceptionHandler } from '../../middlewares/exception-handler';
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
  verifyHelper,
} from '../../middlewares/authenticator';
import { IRequest } from '../../configs/types';

// destructuring assignments

// variable initializations
const router = express.Router();

//USER ROUTES
router
  .route('/')
  .all(verifyToken, verifyUser)
  .post(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { pageId, groupId } = req.query;
      const { content } = req.body;
      const user = req.user._id;
      const args: any = { content, user };
      if (pageId) {
        args.page = pageId;
      } else if (groupId) {
        args.group = groupId;
      }
      const response = await postController.addPost(args);
      res.json(response);
    })
  )
  .get(
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

router
  .route('/:postID')
  .all(verifyToken, verifyUser)
  .put(
    exceptionHandler(async (req: IRequest, res: Response) => {
      let { postID } = req.params;
      const userId = req.user._id;
      const { content } = req.body;
      const args = { content };
      postID = postID?.toString() || '';
      const query = { _id: postID, user: userId };
      const response = await postController.updatePost(query, args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: Request, res: Response) => {
      let { postID } = req.params;
      postID = postID?.toString() || '';
      const response = await postController.deletePostById(postID);
      res.json(response);
    })
  )
  .get(
    exceptionHandler(async (req: Request, res: Response) => {
      const { postID } = req.params;
      const response = await postController.getPostById(postID);
      res.json(response);
    })
  );

//HELPER ROUTES
router
  .route('/helper')
  .all(verifyToken, verifyUser, verifyHelper)
  .post(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { content } = req.body;
      const user = req.user._id;
      const args: any = { content, user };
      const response = await postController.addPost(args);
      res.json(response);
    })
  )
  .get(
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

router
  .route('/helper/:postID')
  .all(verifyToken, verifyUser, verifyHelper)
  .put(
    exceptionHandler(async (req: IRequest, res: Response) => {
      let { postID } = req.params;
      const userId = req.user._id;
      const { content } = req.body;
      const args = { content };
      postID = postID?.toString() || '';
      const query = { _id: postID, user: userId };
      const response = await postController.updatePost(query, args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: Request, res: Response) => {
      let { postID } = req.params;
      postID = postID?.toString() || '';
      const response = await postController.deletePostById(postID);
      res.json(response);
    })
  )
  .get(
    exceptionHandler(async (req: Request, res: Response) => {
      const { postID } = req.params;
      const response = await postController.getPostById(postID);
      res.json(response);
    })
  );

export default router;
