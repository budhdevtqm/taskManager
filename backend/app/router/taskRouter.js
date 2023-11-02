const controller = require("../controllers/taskController");
const router = require("express").Router();
const {
  auth,
  authAdmins,
  uploadMulitpleMiddleware,
} = require("../middlewares/accessMiddlewares");

// files routes
router.post(
  "/add/files/:taskId",
  [uploadMulitpleMiddleware],
  controller.addFiles
);
router.get("/get-files/:taskId", [auth], controller.getTaskFiles);
router.delete("/delete/file/:fileId", [auth], controller.deleteFile);

// task routes
router.get("/get/all", [auth], controller.getAll);
router.patch("/update-status/:id", [auth], controller.updateStatus);
router.get("/:id", [auth], controller.getTask);
router.post("/create", [auth, authAdmins], controller.addTask);
router.patch("/:id", [auth, authAdmins], controller.updateTask);
router.delete("/:id", [auth, authAdmins], controller.deleteTask);

module.exports = router;
