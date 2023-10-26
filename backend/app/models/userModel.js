const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env" });
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASSWORD,
  },
});

const mailText = (name, otp) => {
  return `Dear ${name.toUpperCase()},
  We hope this message finds you well. To enhance the security of your account with us, we require you to complete the OTP (One-Time Password) verification process.

  Please find your OTP below:

  OTP: ${otp}

  Kindly enter this OTP on the verification page to confirm your identity. This OTP will expire in 02:30 minutes, so please use it promptly.

  Thank you for choosing Task Manager. We appreciate your cooperation in maintaining the security of your account.

  Best regards,
  Developer`;
};

module.exports.register = async (values) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password } = values;
    const otp = Math.floor(1000 + Math.random() * 9000);
    try {
      const user = await userSchema.findOne({ email });

      if (user === null) {
        try {
          await bcrypt.hash(password, 10, async (error, hash) => {
            await new userSchema({
              name,
              email,
              password: hash,
              role: "user",
              createdAt: new Date().getTime(),
              updatedAt: 0,
              status: true,
              isVerified: false,
              otp: otp,
              otpExpireAt: new Date().getTime() + 150000,
              otpCreatedAt: new Date().getTime(),
            }).save();
          });

          transporter.sendMail({
            from: process.env.MY_EMAIL,
            to: email,
            subject: "OTP Verification [Task Manager]",
            text: mailText(name, otp),
          });

          resolve({
            status: 201,
            ok: true,
            message: "Register successfully.",
          });
        } catch (er) {
          return reject({
            ok: false,
            status: 400,
            message: "Something went worng",
            ...er,
          });
        }
      }

      if (user.isVerified) {
        console.log("Verified User");
        return reject({
          ok: false,
          message: "This Email is already in use.",
          status: 409,
        });
      }

      if (!user.isVerified) {
        const hash = await new Promise((resolve, reject) => {
          bcrypt.hash(password, 10, (error, hash) => {
            if (error) {
              reject(error);
            } else {
              resolve(hash);
            }
          });
        });

        const updateUser = await userSchema.updateOne(
          {
            _id: user._id.toString(),
          },
          {
            otp,
            name,
            password: hash,
            createdAt: new Date().getTime(),
            otpExpireAt: new Date().getTime() + 150000,
            otpCreatedAt: new Date().getTime(),
          }
        );

        if (updateUser.acknowledged) {
          transporter.sendMail({
            from: process.env.MY_EMAIL,
            to: email,
            subject: "OTP Verification [Task Manager]",
            text: mailText(name, otp),
          });

          resolve({
            status: 201,
            ok: true,
            message: "Register successfully.",
          });
        } else {
          reject({ ok: false, message: "Something went wrong", status: 400 });
        }
      }
    } catch (error) {
      return reject({
        ok: false,
        message: "Something went wrong",
        status: 400,
      });
    }
  });
};

module.exports.resend = async (values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email } = values;

      if (!values.email) {
        return reject({
          ok: false,
          status: 400,
          message: "Please enter email",
        });
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      const user = await userSchema.findOne({ email });

      transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: email,
        subject: "OTP Verification [Task Manager]",
        text: mailText(user.name, otp),
      });

      await userSchema.findOneAndUpdate(
        { email },
        {
          otp: otp,
          otpExpireAt: new Date().getTime() + 150000,
          otpCreatedAt: new Date().getTime(),
        }
      );

      resolve({ ok: true, message: "New OTP send", status: 200 });
    } catch (error) {
      reject({ ok: false, message: "Something went wrong!", status: 400 });
    }
  });
};

module.exports.verifyOTP = async (values) => {
  const { email, otp } = values;
  return new Promise(async (resolve, reject) => {
    try {
      const user = await userSchema.findOne({ email });

      if (!user) {
        throw {
          status: 404,
          ok: false,
          message: "User not found",
        };
      }

      const { otpExpireAt, otp: realOtp } = user;
      const currentTime = new Date().getTime();

      if (realOtp === Number(otp) && otpExpireAt > currentTime) {
        await userSchema.findOneAndUpdate(
          { email },
          {
            isVerified: true,
            status: false,
            otp: 0,
            otpExpireAt: 0,
            otpCreatedAt: 0,
          }
        );

        resolve({
          status: 200,
          ok: true,
          message: "OTP Verified",
        });
      } else if (realOtp !== Number(otp)) {
        throw {
          status: 400,
          ok: false,
          message: "Invalid OTP",
        };
      } else {
        throw {
          status: 400,
          ok: false,
          message: "OTP expired",
        };
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.signin = async (values) => {
  const { email, password } = values;

  return new Promise(async (resolve, reject) => {
    try {
      const user = await userSchema.findOne({ email, isVerified: true });
      if (user === null)
        reject({
          ok: false,
          message: "Invalid Email.",
          status: 400,
        });

      const { password: userPassword, _id, role } = user;
      const userId = _id.toString();
      const isValidPassword = await bcrypt.compare(password, userPassword);

      if (!isValidPassword) {
        throw { ok: false, status: 400, message: "Invalid Password" };
      }

      const token = await jwt.sign({ role, userId }, process.env.JWT_PRIVATE, {
        expiresIn: "1h",
      });

      resolve({
        ok: true,
        status: 200,
        token,
        message: "login successfully.",
        role,
      });
    } catch (error) {
      reject({ status: 400, ...error });
    }
  });
};

module.exports.getAll = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await userSchema.find();
      resolve({ ok: true, status: 200, data: users });
    } catch (error) {
      reject({ ok: false, stauts: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.update = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      await userSchema.findOneAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
          role: req.body.userRole,
          updatedAt: new Date().getTime(),
        }
      );
      resolve({
        ok: true,
        status: 200,
        message: "Updated Successfully.",
      });
    } catch (error) {
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.getUserById = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await userSchema.findOne({ _id: req.params.id });
      if (user === null) {
        reject({ ok: false, status: 400, message: "User Not found!" });
      } else {
        resolve({ ok: true, data: { ...user, password: "" }, status: 200 });
      }
    } catch (error) {
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.delete = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      await userSchema.findOneAndDelete({
        _id: req.params.id,
      });
      resolve({ ok: true, status: 200, message: "Deleted." });
    } catch (error) {
      reject({ ok: false, status: 400, message: "Something went wrong!" });
    }
  });
};

module.exports.create = async (values) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, userRole } = values;
    const isAlready = await userSchema.findOne({ email });
    if (isAlready !== null) {
      return reject({
        ok: false,
        message: "This email already in use!",
        status: 409,
      });
    }

    try {
      await bcrypt.hash(password, 10, async (error, hash) => {
        await new userSchema({
          name,
          email,
          password: hash,
          role: userRole,
          createdAt: new Date().getTime(),
          updatedAt: 0,
          status: true,
          isVerified: true,
          otp: 0,
          otpExpireAt: 0,
          otpCreatedAt: 0,
        }).save();
      });

      resolve({ ok: true, message: "User created successfully.", status: 201 });
    } catch (error) {
      reject({ ok: false, message: "Something went wrong", status: 400 });
    }
  });
};

module.exports.users = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await userSchema.find({ role: "user", isVerified: true });
      const modified =
        users && users.map((user) => ({ label: user.name, value: user._id }));
      resolve({ ok: true, data: modified, status: 200 });
    } catch (error) {
      reject({ ok: false, message: "something went wrong!", status: 400 });
    }
  });
};

module.exports.getProfile = async (values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await userSchema.findOne({ _id: values.userId });
      resolve({
        ok: true,
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
          password: "",
        },
        status: 200,
      });
    } catch (error) {
      reject({ ok: false, message: "Something went wrong!", status: 400 });
    }
  });
};

module.exports.updateProfile = async (values) => {
  return new Promise(async (resolve, reject) => {
    const { name, password, userId } = values;
    try {
      const hash = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (error, hash) => {
          if (error) {
            reject(error);
          } else {
            resolve(hash);
          }
        });
      });

      await userSchema.updateOne(
        { _id: userId },
        { name, password: hash, updatedAt: new Date().getTime() }
      );

      resolve({
        status: 200,
        ok: true,
        message: "Profile Updated successfully.",
      });
    } catch (error) {
      reject({ ok: false, message: "Something went wrong!", status: 400 });
    }
  });
};

module.exports.upload = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = req.file;
      console.log(file, "file");
    } catch (error) {
      reject({ ...error });
    }
  });
};
