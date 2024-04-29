// module imports
import express, { Request, Response } from 'express';

// file imports
import * as pageController from './controller';
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

router.get(
  '/',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    let { keyword } = req.query;
    keyword = keyword?.toString() || '';
    const args = {
      keyword,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await pageController.getElements(args);
    res.json(response);
  })
);
router
  .route('/helper')
  .all(verifyToken, verifyUser, verifyHelper)
  .post(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { title } = req.body;
      const admin = req.user._id;
      const args = { title, admin };
      const response = await pageController.createPage(args);
      res.json(response);
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      const { title } = req.body;
      const args = { title };
      element = element?.toString() || '';
      const response = await pageController.updateElementById(element, args);
      res.json(response);
    })
  )
  .get(
    exceptionHandler(async (req: Request, res: Response) => {
      const { page, limit } = req.query;
      let { keyword } = req.query;
      keyword = keyword?.toString() || '';
      const args = {
        keyword,
        limit: Number(limit),
        page: Number(page),
      };
      const response = await pageController.getElements(args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      element = element?.toString() || '';
      const response = await pageController.deleteElementById(element);
      res.json(response);
    })
  );

router.get(
  '/:element',
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const { element } = req.params;
    const response = await pageController.getElementById(element);
    res.json(response);
  })
);

export default router;
