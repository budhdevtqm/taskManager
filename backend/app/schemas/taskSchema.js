const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: String,
    project: String,
    assignTo: [{ label: String, value: String }],
    dueDate: Number,
    type: {
      type: String,
      enum: ["Frontend", "Backend", "Testing", "Design", "FullStack"],
      default: "",
    },
    progressStatus: {
      type: String,
      enum: ["pending", "in progress", "complete"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "high", "medium"],
      default: "low",
    },
    createdBy: { name: String, id: String },
    taskPay: String,
    createdAt: Number,
    updatedAt: Number,
    status: Boolean,
  },
  { collection: "userTasks" }
);

module.exports = mongoose.model("task", schema);
