const multer = require("multer");
const path = require("path");

const userPictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../public/images/users");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    cb(
      null,
      file.fieldname +
        "_" +
        new Date().getTime() +
        path.extname(file.originalname)
    );
  },
});

module.exports.uploadProfilePic = multer({
  storage: userPictureStorage,
});
