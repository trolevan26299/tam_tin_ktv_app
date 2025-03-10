import mongoose from 'mongoose';
const { Schema } = mongoose;

const transactionLinhKienSchema = new Schema({
    name_linh_kien: { type: String, required: true },
    date_update: { type: String, required: true },
    type: { type: String, required: true },
    nhan_vien: {
      name: { type: String, required: true },
      id: { type: String, required: true }
    },
    nguoi_tao: { type: String, required: true },
    noi_dung: { type: String, required: false },
    total: { type: Number, required: true },
    create_date: { type: String, required: true },
    device_type: { type: String, required: true }
    });
  
  export default mongoose.models.transaction_linh_kien || mongoose.model("transaction_linh_kien", transactionLinhKienSchema, "transaction_linh_kien");