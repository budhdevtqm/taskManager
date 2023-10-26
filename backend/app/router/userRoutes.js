const express = require("express");
const router = express.Router();
const { signupValidation } = require("../validations/userValidation");
const controller = require("../controllers/userControllers");
const { auth, authSuperAdmin } = require("../middlewares/accessMiddlewares");

router.post("/upload-image/profile", [auth], controller.uploadImage)
router.patch("/update/my/profile", [auth], controller.updateMyProfile);
router.get("/my/profile", [auth], controller.getMyProfile);
router.get("/get/users", [auth], controller.allUser);
router.post("/create", [auth, authSuperAdmin], controller.createUser);
router.post("/register", signupValidation, controller.signup);
router.post("/resend-otp", controller.resendOTP);
router.post("/verify-otp", controller.verification);
router.post("/password-signin", controller.signin);
router.get("/get-all", [auth, authSuperAdmin], controller.getAllUsers);
router.get("/get-user/:id", [auth, authSuperAdmin], controller.getUser);
router.patch("/update-user/:id", [auth, authSuperAdmin], controller.updateUser);
router.delete(
  "/delete-user/:id",
  [auth, authSuperAdmin],
  controller.deleteUser
);

module.exports = router;
