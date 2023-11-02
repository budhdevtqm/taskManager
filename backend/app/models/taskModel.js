const taskSchema = require("../schemas/taskSchema");
const userSchema = require("../schemas/userSchema");
const fileSchema = require("../schemas/fileSchema");

module.exports.create = async (values) => {
  return new Promise(async (resolve, reject) => {
    const {
      title,
      project,
      members,
      dueDate,
      priority,
      userId,
      type,
      taskPay,
    } = values;

    const user = await userSchema.findOne({ _id: userId });

    try {
      const added = await new taskSchema({
        title,
        project,
        assignTo: members,
        dueDate: new Date(dueDate).getTime(),
        progressStatus: "pending",
        priority,
        status: true,
        createdBy: { name: user.name, id: userId },
        updatedAt: 0,
        createdAt: new Date().getTime(),
        type,
        taskPay,
      }).save();
      resolve({
        status: 201,
        ok: true,
        message: "Task created Successfully",
        id: added._id.toString(),
      });
    } catch (er) {
      console.log("er", er);
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.all = async (req) => {
  const { role, userId } = req.body;
  return new Promise(async (resolve, reject) => {
    try {
      const allTasks = await taskSchema.find({});

      if (role === "superAdmin") {
        resolve({ ok: true, status: 200, data: allTasks });
        return;
      }

      if (role === "admin") {
        let tasks = allTasks.filter((task) => task.createdBy.id === userId);
        resolve({ ok: true, status: 200, data: tasks });
        return;
      }

      if (role === "user") {
        var arr = [];
        allTasks.filter((task) => {
          const filter = task.assignTo.filter((obj) => {
            if (obj.value === userId) {
              arr.push(task);
            }
          });
        });

        resolve({ ok: true, status: 200, data: arr });
      }
    } catch (er) {
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.get = async (req) => {
  const taskId = req.params.id;
  return new Promise(async (resolve, reject) => {
    try {
      const task = await taskSchema.findOne({ _id: taskId });
      resolve({ ok: true, data: task, status: 200 });
    } catch (er) {
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.update = async (req) => {
  const taskId = req.params.id;
  const values = req.body;
  return new Promise(async (resolve, reject) => {
    try {
      const {
        priority,
        progressStatus,
        project,
        title,
        type,
        dueDate,
        members,
        taskPay,
      } = values;

      await taskSchema.findByIdAndUpdate(
        { _id: taskId },
        {
          priority,
          progressStatus,
          project,
          title,
          type,
          taskPay,
          dueDate: new Date(dueDate).getTime(),
          updatedAt: new Date().getTime(),
          assignTo: members,
        }
      );
      resolve({ ok: true, status: 200, message: "Updated successfully" });
    } catch (er) {
      reject({
        ok: false,
        message: "something went wrong",
        status: 400,
      });
    }
  });
};

module.exports.delete = async (taskId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const delte = await taskSchema.deleteOne({ _id: taskId });
      console.log("delte", delte);
      resolve({ ok: true, status: 200, message: "deleted successfully..." });
    } catch (er) {
      console.log("er", er);
      reject({
        ok: false,
        message: "something went wrong",
        status: 400,
      });
    }
  });
};

module.exports.updateStatus = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const update = await taskSchema.updateOne(
        { _id: req.params.id },
        {
          updatedAt: new Date().getTime(),
          progressStatus: req.body.progressStatus,
        }
      );
      resolve({ ok: true, message: "Updated successfully.", status: 200 });
    } catch (error) {
      reject({
        ok: false,
        message: "something went wrong",
        status: 400,
      });
    }
  });
};

module.exports.addFiles = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = req.body;
      const { taskId } = req.params;
      const files = req.files;

      await Promise.all(
        files.map(async (file) => {
          return new fileSchema({
            filename: file.filename,
            createdAt: Date.now(),
            updatedAt: 0,
            taskId,
            status: true,
            createdBy: userId,
          }).save();
        })
      );

      resolve({
        ok: true,
        message: "Files uploaded successfully.",
        status: 201,
      });
    } catch (error) {
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.getFiles = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { taskId } = req.params;
      const files = await fileSchema.find({ taskId });
      resolve({ ok: true, status: 200, data: files });
    } catch (error) {
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.deleteFile = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { fileId } = req.params;
      await fileSchema.deleteOne({ _id: fileId });
      resolve({ ok: true, message: "File Deleted.", status: 200 });
    } catch (error) {
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};
