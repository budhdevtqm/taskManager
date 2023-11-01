const multer = require("multer");



// const util = require("util");
// const path = require("path");
// const multer = require("multer");

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     console.log("desti", req);
// //     cb(null, "public/images/tasks");
// //   },
// //   filename: function (req, file, cb) {
// //     console.log("filename", file);
// //     cb(null, `${Date.now()}-${file.originalname}`);
// //   },
// // });

// var storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, path.join(`${__dirname}/../../public/images/tasks`));
//   },
//   filename: (req, file, callback) => {
//     console.log("---file---", file);
//     // const match = ["image/png", "image/jpeg"];

//     // if (match.indexOf(file.mimetype) === -1) {
//     //   var message = `<strong>${file.originalname}</strong> is invalid. Only accept png/jpeg.`;
//     //   return callback(message, null);
//     // }

//     var filename = `${Date.now()}-bezkoder-${file.originalname}`;
//     callback(null, filename);
//   },
// });

// const uploadFiles = multer({ storage: storage }).array("files", 10);
// const uploadFilesMiddleware = util.promisify(uploadFiles);
// module.exports = uploadFilesMiddleware;
