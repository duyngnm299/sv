const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  memberCode: {
    type: String,
  },

  fullName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    minlength: 8,
  },
  password: {
    type: String,
    // required: true,
    minlength: 8,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  balance: { type: Number, default: 0 },
  typeAccount: { type: String, enum: ["normal", "google"], default: "normal" },
});

module.exports = mongoose.model("User", userSchema);
