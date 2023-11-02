const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    filename: String,
    taskId: String,
    createdAt: Number,
    updatedAt: Number,
    createdBy: String,
    status: Boolean,
  },
  {
    collection: "files",
  }
);

module.exports = mongoose.model("file", schema);