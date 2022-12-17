import { Router } from 'express';
import { Container } from 'typedi';

import UserController from '../controllers/user.controller';
import { checkUserJwt } from '../middleware/checkJwt';

const userController = Container.get(UserController);
const router = Router();

router.get('/get-level-payments', userController.getLevelPayments);
router.post('/record-transaction', userController.recordTransaction);

export default router;
