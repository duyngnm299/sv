const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide category id"],
    },
    category_name: { type: String },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    describe: { type: Array, required: true },
    area: { type: Number, maxlength: 7 },
    price: { type: Number, default: 0, maxlength: 12 },
    address: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    street: { type: String, required: true },
    images: [Object],
    status: {
      type: String,
      enum: ["deleted", "waiting for approva", "approved"],
      default: "waiting for approva",
    },
    postCode: { type: String },
    numberDayPost: { type: Number },
    postType: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    userInfo: { type: Array },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
