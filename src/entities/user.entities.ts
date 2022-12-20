import mongoose from 'mongoose';

import { ROLES } from '../utils/constants';

const LevelTransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    txn_ref: {
      type: String,
      required: true,
    },
    txn_id: {
      type: String,
      required: true,
    },
    payment_id: {
      type: Object,
      required: true,
      // ref: 'Payment',
    },
    status: {
      type: Boolean,
      default: true,
    },
    naration: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
  },
  { timestamps: true },
);

const UserSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: String,
      default: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    matNo: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      Student: {
        type: Number,
        default: ROLES.Student, // either member (2439) or non-member (1521)
      },
      ClassRep: Number,
      ITPersonel: Number,
    },
    transactions: {
      100: [LevelTransactionSchema],
      200: [LevelTransactionSchema],
      300: [LevelTransactionSchema],
      400: [LevelTransactionSchema],
    },
    currentLevel: {
      type: String,
      default: '400',
    },
  },
  { timestamps: true },
);

export const LevelTransaction = mongoose.model('LevelTransaction', LevelTransactionSchema);
export const User = mongoose.model('User', UserSchema);
