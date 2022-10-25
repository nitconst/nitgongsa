const mongoose = require("mongoose");

const { Schema } = mongoose;
const userTypeSchema = new Schema({
  phone: {
    type: "String",
    unique: true,
  },
  type: {
    type: "String",
  },
});

module.exports = mongoose.model("UserType", userTypeSchema);
