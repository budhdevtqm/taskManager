require("dotenv").config({ path: "../../.env" });
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");

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
