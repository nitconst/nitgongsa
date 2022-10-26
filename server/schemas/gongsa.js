const mongoose = require("mongoose");

const { Schema } = mongoose;
const gongsaSchema = new Schema({
  GPSLatitude: {
    type: Number,
  },
  GPSlongitude: {
    type: Number,
  },
  Usertype: {
    type: String,
  },
  addr: {
    type: String,
  },
  attachmentUrl: {
    type: String,
  },
  code: {
    type: Number,
  },
  createdAt: {
    type: String,
  },
  createdId: {
    type: String,
  },
  docKey: {
    type: String,
  },
  phone: {
    type: String,
  },
  regioncode: {
    type: String,
  },
  regioncode2: {
    type: String,
  },
  text: {
    type: String,
  },
});

module.exports = mongoose.model("Gongsa", gongsaSchema);
