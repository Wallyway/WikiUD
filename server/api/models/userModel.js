import mongoose from "mongoose";

/**
 * User Schema for MongoDB using Mongoose.
 *
 * @typedef {Object} User
 * @property {string} username - The username of the user. It is required and trimmed.
 * @property {string} email - The email of the user. It is required, unique, lowercase, and trimmed.
 * @property {string} password - The password of the user. It is required.
 *
 * @property {Date} createdAt - The date when the user was created. Automatically managed by Mongoose.
 * @property {Date} updatedAt - The date when the user was last updated. Automatically managed by Mongoose.
 */

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // minlength: 6  //FIXME: Comment due to dev purpose
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
