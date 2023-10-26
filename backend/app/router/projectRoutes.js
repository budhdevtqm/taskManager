const controller = require("../controllers/projectController");
const express = require("express");
const router = express.Router();
const { auth, authAdmins } = require("../middlewares/accessMiddlewares");

router.post("/create", [auth, authAdmins], controller.createProject);
router.patch("/update/:id", [auth, authAdmins], controller.updateProject);
router.delete("/delete/:id", [auth, authAdmins], controller.deleteProject);
router.get("/getAll", [auth, authAdmins], controller.getAll);
router.get("/:id", [auth], controller.getProject);

module.exports = router;
 