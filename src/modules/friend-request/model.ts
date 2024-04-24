// module imports
import mongoose from 'mongoose';
import { FRIENDSHIP_STATUS } from '../../configs/enum';

// destructuring assignments
const { PENDING } = FRIENDSHIP_STATUS;

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const friendrequestSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FRIENDSHIP_STATUS),
      default: PENDING,
      index: true,
    },
  },
  { timestamps: true }
);

export default model('friendrequest', friendrequestSchema);
