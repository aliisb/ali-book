// module imports
import express, { Request, Response } from 'express';

// file imports
import admin from '../modules/admin/route';
import auth from '../modules/auth/route';
import element from '../modules/element/route';
import message from '../modules/message/route';
import user from '../modules/user/route';
import post from '../modules/posts/route';
import page from '../modules/pages/route';
import group from '../modules/groups/route';
import like from '../modules/like/route';
import follow from '../modules/follow/route';
import friendrequest from '../modules/friend-request/route';

// destructuring assignments
const { POSTMAN_URL } = process.env;

// variable initializations
const router = express.Router();

router.use('/admin', admin);
router.use('/auth', auth);
router.use('/element', element);
router.use('/send-request', friendrequest);
router.use('/message', message);
router.use('/user', user);
router.use('/post', post);
router.use('/page', page);
router.use('/group', group);
router.use('/like', like);
router.use('/follow', follow);
router.use('/docs', (_req: Request, res: Response) =>
  res.redirect(POSTMAN_URL || '')
);

export default router;
