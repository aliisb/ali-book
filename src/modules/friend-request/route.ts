// module imports
import express, { Request, Response } from 'express';

// file imports
import * as friendrequestController from './controller';
import { exceptionHandler } from '../../middlewares/exception-handler';
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from '../../middlewares/authenticator';
import { IRequest } from '../../configs/types';
import { FRIENDSHIP_STATUS } from '../../configs/enum';

// destructuring assignments
const { ACCEPTED } = FRIENDSHIP_STATUS;
// variable initializations
const router = express.Router();

router.post(
  '/:receiver',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const sender = req.user._id;
    const { receiver } = req.params;
    // Call the controller function to send the friend request
    const args = { sender, receiver };
    const friendRequest = await friendrequestController.createRequest(args);
    res.json(friendRequest);
  })
);

router.get(
  '/',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const receiver = req.user._id;
    const friendRequests = await friendrequestController.getfriendrequestById(
      receiver
    );
    res.json({ data: friendRequests });
  })
);

router.put(
  '/:friendrequest',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { friendrequest } = req.params;
    const status = ACCEPTED;
    const args: any = { status };
    friendrequest = friendrequest?.toString() || '';
    const response = await friendrequestController.updatefriendrequestById(
      friendrequest,
      args
    );
    res.json(response);
  })
);
export default router;
