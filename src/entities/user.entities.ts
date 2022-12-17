import mongoose from 'mongoose';

import { ROLES } from '../utils/constants';

const LevelTransaction = new mongoose.Schema(
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
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Payment',
    },
    status: {
      type: Boolean,
      default: true,
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
      select: false,
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
      Lecturer: Number,
      ClassAdvisorHead: Number,
      DepartmentHOD: Number,
      FacultyDean: Number,
      ITPersonel: Number,
    },
    transactions: {
      100: [LevelTransaction],
      200: [LevelTransaction],
      300: [LevelTransaction],
      400: [LevelTransaction],
    },
    currentLevel: {
      type: String,
      default: '400',
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', UserSchema);
