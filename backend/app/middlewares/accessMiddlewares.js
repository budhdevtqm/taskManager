require("dotenv").config({ path: "../../.env" });
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

module.exports.auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || token == undefined) {
    return res.status(401).json({ ok: false, message: "Invalid Token" });
  }

  try {
    const verify = await jwt.verify(token, process.env.JWT_PRIVATE);
    const { role, userId } = verify;
    req.body.role = role;
    req.body.userId = userId;
    req.body.data = userId;
    next();
  } catch (error) {
    res.status(401).json({ ok: false, message: "Invalid Token", status: 401 });
  }
};

module.exports.authSuperAdmin = async (req, res, next) => {
  const { role } = req.body;
  if (role !== "superAdmin") {
    return res
      .status(403)
      .json({ ok: false, message: "Access Denied", status: 403 });
  }
  next();
};

module.exports.authAdmins = async (req, res, next) => {
  const { role } = req.body;
  if (role === "user") {
    return res
      .status(403)
      .json({ ok: false, message: "Access Denied", status: 403 });
  }
  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports.authAndUploadProfilePic = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || token == undefined) {
    return res.status(401).json({ ok: false, message: "Invalid Token" });
  }

  try {
    const verify = await jwt.verify(token, process.env.JWT_PRIVATE);
    const { role, userId } = verify;

    upload.single("image")(req, res, function (err) {
      if (err) {
        return next(err);
      }
      req.body.role = role;
      req.body.userId = userId;

      next();
    });
  } catch (error) {
    res.status(401).json({ ok: false, message: "Invalid Token", status: 401 });
  }
};

// const taskFileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/tasks"); // Save uploaded files to the 'uploads' directory
//   },
//   filename: (req, file, cb) => {
//     console.log("file,", file);
//     cb(null, Date.now() + "-" + file.originalname); // Rename the file to avoid naming conflicts
//   },
// });

const taskFileStorage = multer({ dest: "public/images/tasks" });

module.exports.uploadMulitpleMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || token == undefined) {
    return res.status(401).json({ ok: false, message: "Invalid Token" });
  }

  try {
    const verify = await jwt.verify(token, process.env.JWT_PRIVATE);
    const { role, userId } = verify;

    taskFileStorage.array("files", 5)(req, res, (er) => {
      if (er) {
        console.log("erd", er);
        next(er);
      }
      req.body.role = role;
      req.body.userId = userId;
      next();
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).json({ ok: false, message: "Invalid Token", status: 401 });
  }
};
