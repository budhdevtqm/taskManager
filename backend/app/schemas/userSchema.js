const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    createdAt: Number,
    updatedAt: Number,
    role: String,
    status: Boolean,
    isVerified: Boolean,
    otp: Number,
    otpExpireAt: Number,
    otpCreatedAt: Number,
    image: { type: String, required: false },
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("user", userSchema);
