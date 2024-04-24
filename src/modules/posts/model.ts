// module imports
import mongoose from 'mongoose';

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },

    media: {
      type: String,
      // required: true,
    },

    content: {
      type: String,
      required: true,
    },

    likescount: {
      type: Number,
      default: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
    },

    sharescount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model('posts', postSchema);
