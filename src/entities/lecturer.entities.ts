import mongoose from 'mongoose';

import { ROLES } from '../utils/constants';

const LecturerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      default: ' ',
    },
    levelInChargeOf: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    login_id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      Lecturer: {
        type: Number,
        default: ROLES,
      },
      ClassAdvisorHead: Number,
      DepartmentHOD: Number,
      FacultyDean: Number,
      ITPersonel: Number,
    },
  },
  { timestamps: true },
);

export const Lecturer = mongoose.model('Lecturer', LecturerSchema);
