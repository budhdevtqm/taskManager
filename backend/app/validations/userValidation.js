const { body } = require("express-validator");

module.exports.signupValidation = [
  body("name").notEmpty().withMessage("Name is Required"),
  body("email").notEmpty().withMessage("Email is Required"),
  body("password").notEmpty().withMessage("Password is Required"),
];
