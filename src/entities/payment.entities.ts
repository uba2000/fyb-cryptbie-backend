import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  levels: {
    type: Object,
    required: true,
  },
});

export const Payment = mongoose.model('Payment', PaymentSchema);
