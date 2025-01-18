import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  type: String,
  email: String,
  note: String,
  regDt: String,
  history_repair: [{
    type_repair: String,
    date_repair: String,
    linh_kien: [{
      id: String,
      name: String,
      total: Number
    }],
    staff_repair: String,
    note: String
  }]
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;