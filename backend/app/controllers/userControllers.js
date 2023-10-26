const model = require("../models/userModel");

module.exports.signup = async (req, res) => {
  try {
    const response = await model.register(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.resendOTP = async (req, res) => {
  try {
    const response = await model.resend(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.verification = async (req, res) => {
  try {
    const response = await model.verifyOTP(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.signin = async (req, res) => {
  try {
    const response = await model.signin(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const response = await model.getAll();
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const response = await model.update(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const response = await model.getUserById(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const response = await model.delete(req);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const response = await model.create(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.allUser = async (req, res) => {
  try {
    const response = await model.users();
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.getMyProfile = async (req, res) => {
  try {
    const response = await model.getProfile(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.updateMyProfile = async (req, res) => {
  try {
    const response = await model.updateProfile(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports.uploadImage = async (req, res) => {
  try {
    const response = await model.upload(req);
    console.log("response", response);
  } catch (error) {
    console.log("error", error);
  }
};
