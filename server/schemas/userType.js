const mongoose = require("mongoose");

const { Schema } = mongoose;
const userTypeSchema = new Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserType", userTypeSchema);
