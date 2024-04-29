// module imports
import mongoose from 'mongoose';

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const groupSchema = new Schema(
  {
    admin: {
      type: String,
      ref: 'helper',
      require: true,
    },
    moderator: {
      type: String,
      ref: 'helper',
    },
    members: [
      {
        type: String,
        ref: 'user',
      },
    ],
    title: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model('groups', groupSchema);
