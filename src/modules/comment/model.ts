import mongoose from "mongoose";
const Schema = mongoose.Schema;
const model = mongoose.model;
const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("comments", commentSchema);
