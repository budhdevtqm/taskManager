const controller = require("../controllers/taskController");
const router = require("express").Router();
const { auth, authAdmins } = require("../middlewares/accessMiddlewares");

router.get("/get/all", [auth], controller.getAll);
router.get("/:id", [auth], controller.getTask);
router.post("/create", [auth, authAdmins], controller.addTask);
router.patch("/:id", [auth, authAdmins], controller.updateTask);
router.delete("/:id", [auth, authAdmins], controller.deleteTask);
router.patch("/update-status/:id", [auth], controller.updateStatus);

module.exports = router;
