import { Response, Request, NextFunction } from 'express';
import { Service } from 'typedi';
import validator from 'validator';

import LecturerService from '../services/lecturer.services';

@Service()
class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}
  studentPaymentLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = req.jwtPayload;
      res.customSuccess(200, await this.lecturerService.getStudentPaymentLogs(authUser, next));
    } catch (error) {
      next();
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.lecturerService.login(req.body, next));
    } catch {
      next();
    }
  };

  getAllPaymentTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.lecturerService.getAllPaymentTypes(req.body, next));
    } catch {
      next();
    }
  };
}

export default LecturerController;
