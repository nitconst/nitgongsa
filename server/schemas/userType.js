const mongoose = require("mongoose");

const { Schema } = mongoose;
const userTypeSchema = new Schema({
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("UserType", userTypeSchema);
