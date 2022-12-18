import { Router } from 'express';
import { Container } from 'typedi';

import LecturerController from '../controllers/lecturer.controller';
import { validatorLecturerLogin } from '../middleware/validation/auth';

const lecturerController = Container.get(LecturerController);
const router = Router();

router.get('/student-payment-logs', lecturerController.studentPaymentLogs);
router.get('/student-payment-types', lecturerController.getAllPaymentTypes);

export default router;
