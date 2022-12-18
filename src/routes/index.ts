import { Router } from 'express';
import { Container } from 'typedi';

import UserController from '../controllers/user.controller';
import { checkUserJwt, checkStaffJwt } from '../middleware/checkJwt';

import auth from './auth';
import lecturer from './lecturer';
import profile from './profile';
import user from './user';

const userController = Container.get(UserController);
const router = Router();

//sub routes
router.use('/auth', auth);
router.use('/user', checkUserJwt, user);
router.use('/lecturer', checkStaffJwt, lecturer);
router.use('/profile', checkUserJwt, profile);

// router.delete('/', userController.delele)
// router.get('/all', userController.all)

export default router;
