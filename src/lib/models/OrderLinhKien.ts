import mongoose from 'mongoose';

const orderLinhKienSchema = new mongoose.Schema({
  chi_tiet_linh_kien: [{
    id_linh_kien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'linh_kien'
    },
    so_luong: Number,
    price: Number
  }],
  id_khach_hang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customers'
  },
  ghi_chu: String,
  tong_tien: Number,
  loi_nhuan: Number,
  ngay_tao: {
    type: Date,
    default: Date.now
  }
});

const OrderLinhKien = mongoose.models.order_linh_kien || mongoose.model('order_linh_kien', orderLinhKienSchema, 'order_linh_kien');

export default OrderLinhKien;