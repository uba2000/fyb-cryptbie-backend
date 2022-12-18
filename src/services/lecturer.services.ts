import path from 'path';

import { compareSync } from 'bcrypt';
import { NextFunction } from 'express';
import { Service } from 'typedi';

import { Lecturer, Payment, User } from '../entities';
import WalletService from '../services/wallet.services';
import { createStaffJwtToken } from '../utils/createJwtToken';
import { CustomError } from '../utils/response/custom-error/CustomError';

@Service()
class LecturerService {
  constructor(
    private readonly walletService: WalletService,
    private readonly lecturer = Lecturer,
    private readonly payment = Payment,
    private readonly user = User,
  ) {}

  async getStudentPaymentLogs(payload, next: NextFunction) {
    try {
      const lecturer = await this.lecturer.findById(payload.id);

      const usersUnderLecturer = await this.user.find({
        levels: lecturer.levelInChargeOf,
      });

      const allPayments: typeof User[] = [];

      usersUnderLecturer.forEach((d: any) => {
        if (lecturer.levelInChargeOf === 'all') {
          // add all level arrays of current user
          const allLevelKeys = Object.keys(d.transactions);

          // lk -> level_key e.g: '100', '200'...
          Array.from(allLevelKeys).forEach((lk) => {
            if (d.transactions[lk].length > 0) {
              d.transactions[lk].forEach((dt: any) => {
                dt = { ...dt._doc, name: `${d.firstname} ${d.lastname}` };
                allPayments.push(dt);
              });
            }
          });
        } else {
          // add just the level of the lecturer
          const levelTransactions = d.transactions[lecturer.levelInChargeOf];
          levelTransactions.forEach((dt: any) => {
            dt = { ...dt._doc, name: `${d.firstname} ${d.lastname}` };
            allPayments.push(dt);
          });
        }
      });

      return {
        status: 'success',
        message: 'student payment log retrieved successfully',
        data: allPayments,
      };
    } catch (error) {
      console.log(error);

      return next(new CustomError(400, 'Raw', `User '${payload.matNo}' can't be created`, null, error));
    }
  }

  async getAllPaymentTypes(payload, next: NextFunction) {
    try {
      const allPaymentTypes = await this.payment.find();

      return {
        status: 'success',
        message: 'transaction retrieved successfully',
        data: allPaymentTypes,
      };
    } catch (error) {
      console.log(error);

      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }

  async login(payload, next: NextFunction) {
    try {
      const lecturer = await this.lecturer.findOne({
        login_id: payload.login_id.toLowerCase(),
      });

      if (!lecturer) {
        return { message: 'Invalid credentials', status: 'fail', data: null };
      }

      if (!compareSync(payload.password, lecturer?.password)) {
        return { message: 'Invalid login id or password', status: 'fail', data: null };
      }

      const lecturerResult = {
        status: 'success',
        message: 'login successfully',
        token: createStaffJwtToken({
          id: lecturer._id,
          login_id: lecturer.login_id,
        }),
        data: lecturer,
      };

      return lecturerResult;
    } catch (error) {
      console.log(error);

      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }
}

export default LecturerService;
