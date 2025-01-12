import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: String,
  username_telegram: String,
  user_id_telegram: String,
  status: String,
  regDt: String
});

export const UserModel = mongoose.models?.Staff || mongoose.model('Staff', userSchema);