import mongoose from "mongoose";

const { Schema } = mongoose;

const deviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id_device: {
    type: String,
    unique: true,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  warranty: {
    type: Number,
    require: true,
  },
  status: {
    type: Number,
    require: true,
  },
  belong_to: {
    type: String,
    require: true,
  },
  delivery_date: {
    type: String,
    require: true,
  },
  note: {
    type: String,
  },
});

export default mongoose.model("devices", deviceSchema);
