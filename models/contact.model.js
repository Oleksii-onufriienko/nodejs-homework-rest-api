const mongoose = require("mongoose");
const { SchemaTypes } = mongoose;
const Schema = mongoose.Schema;

const Contact = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("Contact", Contact);
