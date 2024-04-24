// module imports
import express, { Request, Response } from 'express';

// file imports
import TwilioManager from '../../utils/twilio-manager';
import * as authController from '../auth/controller';
import * as notificationController from '../notification/controller';
import * as userController from './controller';
import { upload } from '../../middlewares/uploader';
import { exceptionHandler } from '../../middlewares/exception-handler';
import { IRequest } from '../../configs/types';
import {
  verifyOTP,
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyUserToken,
} from '../../middlewares/authenticator';
import { PUBLIC_DIRECTORY } from '../../configs/directories';
const uploadTemporary = upload(PUBLIC_DIRECTORY);

// destructuring assignments

// variable initializations
const router = express.Router();

router.put(
  '/update-complete-profile',
  verifyToken,
  verifyUser,
  uploadTemporary.single('image'),
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { firstName, lastName, gender, DOB } = req.body;
    const image = req.file;
    const userObj = {
      image: image.filename,
      firstName,
      lastName,
      gender,
      DOB,
    };

    const user: any = req.user._id;
    const userdata = await userController.completeProfile(user, userObj);
    res.json(userdata);
  })
);

router.get(
  '/my-profile',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const user = req.user._id;

    const args: any = { user };
    const response = await userController.getUserProfile(args);
    res.json(response);
  })
);

router.get(
  '/:otheruserId',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const user = req.user._id;
    const { otheruserId } = req.params;
    console.log(otheruserId);
    const args = { user, otheruserId: String(otheruserId) };
    const response = await userController.getUser(args);
    res.json(response);
  })
);

router.get(
  '/users/all',

  exceptionHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const args: any = {
      limit: Number(limit),
      page: Number(page),
    };
    const response = await userController.getUsers(args);
    res.json(response);
  })
);
router.put(
  '/phone',
  verifyToken,
  verifyOTP,
  verifyUserToken,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user, phone } = req.user;
    const args = { phone };
    const response = await userController.updateUserById(user, args);
    res.json(response);
  })
);
router.put(
  '/password',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user, email, type } = req.user;
    const { password, newPassword } = req.body;
    const args = { password, email, type };
    await authController.login(args);
    args.password = newPassword;
    const response = await userController.updateUserById(user, args);
    res.json(response);
  })
);

router
  .route('/otp')
  .post(
    verifyToken,
    verifyUser,
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
      const { phone } = req.body;
      const args = { user, phone };
      const response = await new TwilioManager().sendOTP(args);
      res.json({ token: response });
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      const { phone } = req.body;
      const args = { phone };
      const response = await new TwilioManager().sendOTP(args);
      res.json({ token: response });
    })
  );

router
  .route('/notification')
  .all(verifyToken, verifyUser)
  .get(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
      const { page, limit } = req.query;
      const args = { user, limit: Number(limit), page: Number(page) };
      const response = await notificationController.getElements(args);
      res.json(response);
    })
  )
  .patch(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { _id: user } = req.user;
      await notificationController.readNotifications(user);
      res.json({ message: 'Operation completed successfully!' });
    })
  );

// router.get(
//   '/me',
//   verifyToken,
//   verifyUser,
//   exceptionHandler(async (req: IRequest, res: Response) => {
//     const { _id: user } = req.user;
//     const { device } = req.query;
//     const args = { user, device: device?.toString() || '' };
//     const response = await userController.getUserProfile(args);
//     res.json(response);
//   })
// );

// router.get(
//   '/:user',
//   verifyToken,
//   verifyAdmin,
//   exceptionHandler(async (req: Request, res: Response) => {
//     const { user } = req.params;
//     const response = await userController.getUserById(user);
//     res.json(response);
//   })
// );

export default router;
