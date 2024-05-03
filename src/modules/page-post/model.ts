import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const model = mongoose.model;
const pagePostSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
    },
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'pages',
    },
  },
  {
    timestamps: true,
  }
);

export default model('page-post', pagePostSchema);
