import path from 'path';

import axios from 'axios';
import { compareSync, hashSync } from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { NextFunction } from 'express';
import { Service } from 'typedi';

import { User, Payment, Transaction } from '../entities';
import WalletService from '../services/wallet.services';
import { createUserJwtToken } from '../utils/createJwtToken';
import { CustomError } from '../utils/response/custom-error/CustomError';

@Service()
class UserService {
  constructor(
    private readonly walletService: WalletService,
    private readonly user = User,
    private readonly payment = Payment,
    private readonly transaction = Transaction,
  ) {}

  async register(payload, next: NextFunction) {
    try {
      const usertest = await this.user.findOne({
        matNo: payload.matNo.toLowerCase(),
        email: payload.email.toLowerCase(),
      });
      if (usertest) {
        // next(new CustomError(400, 'Raw', `User '${payload.matNo}' can't be created`, null, null));
        return { message: 'Matric Number or Email is already associated with an account', status: 'fail', data: null };
      }

      const usernew = new this.user({
        phoneNumber: payload.phoneNumber,
        email: payload.email,
        password: hashSync(payload.password, 12),
        firstname: payload.firstname,
        lastname: payload.lastname,
        matNo: payload.matNo.toLowerCase(),
        currentLevel: payload.currentLevel,
      });

      await usernew.save();

      return { message: 'registration successful', status: 'success', data: usernew };
    } catch (err) {
      console.log(err);

      return next(new CustomError(400, 'Raw', `User '${payload.matNo}' can't be created`, null, err));
    }
  }

  async delete(email) {
    // let a = await this.user.delete({ email });
    // return a;
  }

  async all() {
    console.log(path.resolve(process.cwd(), 'dsfdf.xlsx'));
    return await this.user.find({ select: ['email'] });
  }

  // async confirmAccount(userId, password, location, next: NextFunction) {
  //   try {
  //     const user = await this.user.findOneBy({ id: userId });
  //     if (!user) {
  //       return next(new CustomError(400, 'General', 'User Account not found'));
  //     }
  //     if (user.verified) {
  //       return { message: 'Account already verified' };
  //     }
  //     user.password = hashSync(password, 10);
  //     user.verified = true;
  //     await user.save();
  //     const response = (await this.walletService.create(
  //       {
  //         firstname: user.firstname,
  //         lastname: user.lastname,
  //         email: user.email,
  //         phone: user.phoneNumber,
  //         pin: password,
  //         location: location,
  //       },
  //       next,
  //     )) as any;
  //     let wallet = await this.wallet.save({
  //       accountNo: String(response.result.data.account_no),
  //       balance: String(response.result.data.balance),
  //       bank_code: '000',
  //     });
  //     user.wallet = wallet;
  //     await user.save();
  //     delete user.password;
  //     return {
  //       token: createUserJwtToken({ id: user.id, contact: user.email }),
  //     };
  //   } catch (err) {
  //     return next(new CustomError(400, 'Raw', err));
  //   }
  // }
  async login(payload, next: NextFunction) {
    try {
      const user = await this.user.findOne({
        matNo: payload.matNo.toLowerCase(),
      });

      if (!user) {
        return { message: 'Invalid credentials', status: 'fail', data: null };
      }

      if (!compareSync(payload.password, user?.password)) {
        return { message: 'Invalid matric number or password', status: 'fail', data: null };
      }

      const a = {
        status: 'success',
        message: 'login successfully',
        token: createUserJwtToken({ id: user._id }),
        data: user,
      };

      if (a.data) {
        delete a.data.password;
        // delete a.data.wallet;
      }

      return a;
    } catch (err) {
      console.log(err);

      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  }

  async getLevelPayments(payload, next: NextFunction) {
    try {
      const user = await this.user.findById(payload.id);

      const userPayments = await this.payment.find({
        $or: [{ levels: user?.currentLevel }, { levels: 'all' }],
      });

      const allPayments = userPayments.map((d: any) => {
        const isPaid = user.transactions[user.currentLevel].find(
          (ut: any) => ut.payment_id.toString() === d._id.toString(),
        );

        const payData = { ...d._doc, paid: !!isPaid };

        if (isPaid) {
          payData.createdAt = isPaid?.createdAt;
          payData.price = isPaid?.amount;
        }

        return payData;
      });

      return {
        status: 'success',
        message: 'transaction retrieved successfully',
        data: allPayments,
      };
    } catch (error) {
      console.log(error);

      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }

  async recordTransaction(payload, next: NextFunction) {
    try {
      const user = await this.user.findById(payload.id);

      const { tx_ref, tx_id, amount, payment_id } = payload.body;

      const payment = await this.payment.findById(payment_id);
      console.log({ payment });

      user.transactions[user.currentLevel].push({
        txn_ref: tx_ref,
        txn_id: tx_id,
        payment_id: payment,
        amount,
      });

      const newTransaction = new this.transaction({
        amount,
        tx_ref,
        userId: user._id,
        payment_id: payment,
      });

      await user.save();

      await newTransaction.save();

      return {
        status: 'success',
        message: 'transaction saved successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);

      return next(new CustomError(400, 'Raw', 'Error', null, error));
    }
  }

  // async forgotPassword(email, next: NextFunction) {
  //   try {
  //     const user = await this.user.findOneBy({ email });
  //     if (!user) {
  //       return next(new CustomError(400, 'General', "Account doesn't exists"));
  //     }
  //     const token = String(Math.floor(Math.pow(10, 5) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 5) - 1)));
  //     await user.save();
  //     setTimeout(await decativate, 900000);
  //     async function decativate() {
  //       await user.save();
  //     }
  //     return { message: 'Please input the code sent to your mail' };
  //   } catch (error) {
  //     return next(new CustomError(400, 'Raw', 'Error', null, error));
  //   }
  // }

  // async getProfile({ id }, next: NextFunction) {
  //   try {
  //     return await this.user.findOneBy({ id });
  //   } catch (err) {
  //     return next(new CustomError(400, 'Raw', 'Error', null, err));
  //   }
  // }
}
export default UserService;
