const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    createdBy: { name: String, id: String },
    createdAt: Number,
    updatedAt: Number,
    status: Boolean,
    isCompleted: Boolean,
    dueDate: Number,
  },
  {
    collection: "projects",
  }
);

module.exports = mongoose.model("project", projectSchema);
