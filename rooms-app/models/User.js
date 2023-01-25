const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add a email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    hashedPassword: {
      type: String,
      required: [true, 'Please add a password']
    },
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
    },
    slackID: String,
    googleID: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;