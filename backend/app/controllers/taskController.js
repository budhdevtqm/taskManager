const model = require("../models/taskModel");

module.exports.addTask = async (req, res) => {
  try {
    const response = await model.create(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const response = await model.all(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.getTask = async (req, res) => {
  try {
    const response = await model.get(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.updateTask = async (req, res) => {
  try {
    const response = await model.update(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).josn(error);
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const response = await model.delete(req.params.id);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).josn(error);
  }
};

module.exports.updateStatus = async (req, res) => {
  try {
    const response = await model.updateStatus(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.addFiles = async (req, res) => {
  try {
    const response = await model.addFiles(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.getTaskFiles = async (req, res) => {
  try {
    const response = await model.getFiles(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.deleteFile = async (req, res) => {
  try {
    const response = await model.deleteFile(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};
