// module imports
import mongoose from 'mongoose';

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('profile', profileSchema);
