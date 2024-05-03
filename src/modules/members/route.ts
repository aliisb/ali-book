// module imports
import express, { Request, Response } from 'express';

// file imports
import * as memberController from './controller';
import { exceptionHandler } from '../../middlewares/exception-handler';
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
  verifyHelper,
} from '../../middlewares/authenticator';
import { IRequest } from '../../configs/types';
import { MEMBERSHIP_STATUS } from '../../configs/enum';

// destructuring assignments
const { ACCEPTED } = MEMBERSHIP_STATUS;
// variable initializations
const router = express.Router();

router.post(
  '/:groupId',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const userId = req.user._id;
    const { groupId } = req.params;
    console.log(`group--------->${groupId}`);
    // Call the controller function to send the friend request
    const args = { userId, groupId };
    const joinRequest = await memberController.joinRequest(args);
    res.json(joinRequest);
  })
);

router.get(
  '/helper/:groupId',
  verifyToken,
  verifyUser,
  verifyHelper,
  exceptionHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const joinRequests = await memberController.getJoinRequestById(groupId);
    res.json(joinRequests);
  })
);

router.put(
  '/helper/:joinRequest',
  verifyToken,
  verifyUser,
  verifyHelper,
  exceptionHandler(async (req: Request, res: Response) => {
    let { joinRequest } = req.params;
    // const { status } = req.body;
    const status = ACCEPTED;
    const args: any = { status };
    joinRequest = joinRequest?.toString() || '';
    const response = await memberController.updateJoinRequestById(
      joinRequest,
      args
    );
    res.json(response);
  })
);
export default router;
