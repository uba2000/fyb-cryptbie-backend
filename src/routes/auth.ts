import { Router } from 'express';
import { Container } from 'typedi';

import LecturerController from '../controllers/lecturer.controller';
import UserController from '../controllers/user.controller';
import { validatorLecturerLogin, validatorLogin, validatorRegister } from '../middleware/validation/auth';

const userController = Container.get(UserController);
const lecturerController = Container.get(LecturerController);
const router = Router();

router.post('/login', [validatorLogin], userController.login);
router.post('/lecturer/login', [validatorLecturerLogin], lecturerController.login);
router.post('/register', [validatorRegister], userController.register);
// router.post('/change-password', changePassword);

export default router;
