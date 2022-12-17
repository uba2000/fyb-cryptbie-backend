import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../../../utils/response/custom-error/types';

export const validatorRegister = (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber, email, currentLevel, password, firstname, lastname, matNo } = req.body;
  const errorsValidation: ErrorValidation[] = [];
  const reg = /^0(7|8|9)(0|1)\d{8}$/;
  const no = /^\d{4}$/;

  console.log(req.body, errorsValidation);
  if (!reg.test(phoneNumber)) {
    errorsValidation.push({ phoneNumber: 'Not a valid phone number format' });
  }

  if (typeof email != 'string' || !validator.isEmail(email)) {
    errorsValidation.push({ email: 'Not a valid email format' });
  }

  if (typeof matNo != 'string' || validator.isEmpty(matNo)) {
    errorsValidation.push({ matNo: 'matNo is required' });
  }

  if (typeof firstname != 'string' || validator.isEmpty(firstname)) {
    errorsValidation.push({ firstname: 'firstname is required' });
  }

  if (typeof password != 'string' || validator.isEmpty(password)) {
    errorsValidation.push({ password: 'password is required' });
  }

  if (typeof lastname != 'string' || validator.isEmpty(lastname)) {
    errorsValidation.push({ lastname: 'lastname is required' });
  }

  if (typeof currentLevel != 'string' || validator.isEmpty(currentLevel)) {
    errorsValidation.push({ currentLevel: 'currentLevel is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Register validation error', null, null, errorsValidation);
    return next(customError);
  }

  req.body.phoneNumber = phoneNumber.replace('0', '+234');
  return next();
};
