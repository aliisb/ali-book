// module imports
import express, { Request, Response } from 'express';

// file imports
import * as authController from './controller';
import * as userController from '../user/controller';
import { USER_TYPES } from '../../configs/enum';
import { exceptionHandler } from '../../middlewares/exception-handler';
import {
  verifyOTP,
  verifyKey,
  verifyToken,
  verifyUser,
  verifyUserToken,
} from '../../middlewares/authenticator';
import { IRequest } from '../../configs/types';
import { token } from 'morgan';

// destructuring assignments
const { ADMIN, USER, HELPER } = USER_TYPES;

// variable initializations
const router = express.Router();

//User Registeration
router.post(
  '/register/user',
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const args = { email, password, name, type: USER };
    const response = await authController.register(args);
    res.json({ token: response });
  })
);

//Helper Registeration
router.post(
  '/register/helper',
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const args = { email, password, name, type: HELPER };
    const response = await authController.register(args);
    res.json({ token: response });
  })
);

//Admin Registeration
router.post(
  '/register/admin',
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const args = { email, password, name, type: ADMIN };
    const response = await authController.register(args);
    res.json({ token: response });
  })
);

//User Login
router.post(
  '/login/user',
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const args = { email, password, type: USER };
    const response = await authController.login(args);
    res.json({ token: response });
  })
);

//Helper Login
router.post(
  '/login/helper',
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const args = { email, password, type: HELPER };
    const response = await authController.login(args);
    res.json({ token: response });
  })
);

//Admin Login
router.post(
  '/login/admin',
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const args = { email, password, type: ADMIN };
    const response = await authController.login(args);
    res.json({ token: response });
  })
);

router.post(
  '/logout',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req.user;
    const { device } = req.body;
    const args = { user, device, shallRemoveFCM: true };
    await userController.updateUserById(user, args);
    res.json({ message: 'Operation completed successfully!' });
  })
);

router
  .route('/password/email')
  .post(
    exceptionHandler(async (req: Request, res: Response) => {
      const { email } = req.body;
      const args = { email };
      await authController.emailResetPassword(args);
      res.json({ message: 'Operation completed successfully!' });
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      const { password, user, token } = req.body;
      const args = { password, user, token };
      await authController.resetPassword(args);
      res.json({ message: 'Operation completed successfully!' });
    })
  );

router.post(
  '/login/phone',
  verifyToken,
  verifyOTP,
  verifyUserToken,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { _id: user } = req.user;
    const args = { user };
    const response: any = await userController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  '/login/google',
  exceptionHandler(async (req: Request, res: Response) => {
    const { googleId } = req.body;
    const args = { googleId };
    const response: any = await userController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  '/login/facebook',
  exceptionHandler(async (req: Request, res: Response) => {
    const { facebookId } = req.body;
    const args = { facebookId };
    const response: any = await userController.getUser(args);
    res.json({ token: response.getSignedjwtToken() });
  })
);

router.post(
  '/login/admin',
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const args = { email, password, type: ADMIN };
    const response = await authController.login(args);
    res.json({ token: response });
  })
);

router.post(
  '/register/admin',
  verifyKey,
  exceptionHandler(async (req: Request, res: Response) => {
    const { email, password, type } = req.body;
    const args = { email, password, type: type ?? ADMIN, name: type };
    const response = await authController.register(args);
    res.json({ token: response });
  })
);

export default router;
