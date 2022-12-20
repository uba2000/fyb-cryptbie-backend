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
    transaction_type: {
      type: String,
      // quickteller - Q
      // flutterwave - F
      default: 'F',
    },
    naration: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Transaction = mongoose.model('Transaction', TransactionSchema);
