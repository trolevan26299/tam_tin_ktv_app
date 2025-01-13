import mongoose from "mongoose";

const { Schema } = mongoose;

const history_repairSchema = new Schema({
  type_repair: { // sữa chữa hay bảo hành
    type: String,
    require: true,
  },
  date_repair: { // ngày sữa chữa
    type: String,
    require: true,
  },
  linh_kien: { // linh kiện sửa chữa
    type: [
      {
        id: { // mã linh kiện
          type: String,
          require: true,
        },
        name: {
          type: String,
          require: true,
        },
        total: { // số lượng linh kiện
          type: Number,
          require: true,
        },
      },
    ],
    require: false,
  },
  staff_repair: { 
    type: String,
    require: false,
  },
  note: { // ghi chú
    type: String,
    require: false,
  },
});

const deviceSchema = new Schema({
  name: { // tên thiết bị
    type: String,
    required: true,
  },
  id_device: { // mã thiết bị
    type: String,
    unique: true,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  type_customer: { // khách hàng cá nhân hay ngân hàng
    type: String,
    require: false,
  },
  name_customer: { // tên khách hàng
    type: String,
    require: false,
  },
  history_repair: { // lịch sử sửa chữa
    type: [history_repairSchema],
    require: false,
  },

});

export default mongoose.models.Device_list || mongoose.model("Device_list", deviceSchema);
