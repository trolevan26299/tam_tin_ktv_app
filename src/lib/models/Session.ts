import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  token: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  createdAt: { type: Date, default: Date.now },
  expires: { type: Number } 
});

export const SessionModel = mongoose.models?.Sessions || mongoose.model('Sessions', sessionSchema);