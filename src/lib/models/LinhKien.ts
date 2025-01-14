import mongoose from "mongoose";

const { Schema } = mongoose;

const userCreateSchema = new Schema({
  username: String,
  id: String,
  _id: mongoose.Schema.Types.ObjectId,
});

const dataUngSchema = new Schema({
  name: String,
  id: String,
  total: Number,
  _id: mongoose.Schema.Types.ObjectId,
});

const linhKienSchema = new Schema({
  name_linh_kien: { type: String, required: true },
  total: { type: Number, required: true },
  create_date: { type: String, required: true },
  user_create: { type: userCreateSchema, required: true },
  data_ung: { type: [dataUngSchema], required: false },
});

export default mongoose.models.linh_kien || mongoose.model("linh_kien", linhKienSchema ,'linh_kien');