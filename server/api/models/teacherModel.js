import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  signature: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Teacher", teacherSchema);
