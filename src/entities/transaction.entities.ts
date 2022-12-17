import mongoose, { Schema } from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    remit_amount: {
      type: Number,
      default: '',
    },
    tx_ref: {
      type: String,
      required: true,
    },
    payment_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Payment',
    },
    currency: {
      type: String,
      default: 'ngn',
    },
    flw_ref: {
      type: String,
      default: '',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    transaction_type: {
      type: String,
      // quickteller - Q
      // flutterwave - F
      default: 'F',
    },
  },
  { timestamps: true },
);

export const Transaction = mongoose.model('Transaction', TransactionSchema);
