const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  ads: { type: Boolean },
  ios_version: { type: String },
  android_version: { type: String },
  release_note: { type: String },
});

module.exports = mongoose.model("Setting", settingSchema);
