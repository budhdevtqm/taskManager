const model = require("../models/projectModel");

module.exports.createProject = async (req, res) => {
  try {
    const response = await model.create(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.updateProject = async (req, res) => {
  console.log("req", req.body);
  try {
    const response = await model.update(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.deleteProject = async (req, res) => {
  try {
    const response = await model.delete(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const response = await model.all(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.getProject = async (req, res) => {
  try {
    const response = await model.get(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};
