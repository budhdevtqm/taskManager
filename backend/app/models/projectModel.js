const projectSchema = require("../schemas/projectSchema");
const userSchema = require("../schemas/userSchema");

module.exports.create = async (values) => {
  const { name, description, dueDate, userId } = values;
  console;
  return new Promise(async (resolve, reject) => {
    try {
      const user = await userSchema.findOne({ _id: userId });

      await new projectSchema({
        name,
        description,
        createdBy: { name: user.name, id: userId },
        createdAt: new Date().getTime(),
        updatedAt: 0,
        status: true,
        isCompleted: false,
        dueDate: new Date(dueDate).getTime(),
      }).save();

      resolve({ ok: true, message: "Created Successfully.", status: 201 });
    } catch (error) {
      reject({ ok: false, message: "Something went wrong!", status: 400 });
    }
  });
};

module.exports.update = async (req) => {
  return new Promise(async (resolve, reject) => {
    const { name, description, dueDate } = req.body;
    try {
      await projectSchema.updateOne(
        { _id: req.params.id },
        {
          name,
          description,
          dueDate: new Date(dueDate).getTime(),
          updatedAt: new Date().getTime(),
        }
      );

      resolve({ ok: true, message: "Updated Successfully.", status: 200 });
    } catch (error) {
      reject({ ok: false, message: "Something went wrong", status: 400 });
    }
  });
};

module.exports.delete = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      await projectSchema.findOneAndDelete({ _id: req.params.id });
      resolve({ ok: true, message: "Deleted", status: 200 });
    } catch (error) {
      reject({ ok: false, message: "Something went wrong!", status: 400 });
    }
  });
};

module.exports.get = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await projectSchema.findOne({ _id: req.params.id });
      resolve({ ok: true, data: response, status: 200 });
    } catch (error) {
      reject({ ok: false, message: "Something went wrong!", status: 400 });
    }
  });
};

module.exports.all = async (values) => {
  const { role, userId } = values;
  return new Promise(async (resolve, reject) => {
    try {
      if (role === "admin") {
        const data = await projectSchema.find({});
        const myCreated = data.filter((p) => p.createdBy.id === userId);
        resolve({ ok: true, data: myCreated, status: 200 });
        return;
      } else {
        const data = await projectSchema.find();
        resolve({ ok: true, data, status: 200 });
      }
    } catch (error) {
      reject({ ok: false, message: "Something went wrong!", status: 400 });
    }
  });
};
