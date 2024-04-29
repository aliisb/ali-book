import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const model = mongoose.model;
const followerSchema = new Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  { timestamps: true }
);

export default model('followers', followerSchema);
