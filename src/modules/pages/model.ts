// module imports
import mongoose from 'mongoose';

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const pageSchema = new Schema(
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
    title: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model('pages', pageSchema);
