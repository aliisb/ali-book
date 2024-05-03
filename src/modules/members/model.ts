// module imports
import mongoose from 'mongoose';
import { MEMBERSHIP_STATUS } from '../../configs/enum';

// destructuring assignments
const { PENDING } = MEMBERSHIP_STATUS;

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const memberSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'groups',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MEMBERSHIP_STATUS),
      default: PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('members', memberSchema);
