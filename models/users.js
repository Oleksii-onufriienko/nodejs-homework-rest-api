var gravatar = require("gravatar");
const fs = require("fs/promises");
const Jimp = require("jimp");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { v4: uuidv4 } = require("uuid");

const User = require("../models/user.model");
const { hashPassword, comparePasswords } = require("../utils/hash.util");
const { jwtSign } = require("../utils/jwt.util");

const signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(409).send({
        message: "Email in use",
      });
    }

    const newUser = await User.create({
      ...req.body,
      password: hashPassword(password),
      avatarURL: gravatar.url(email),
      verificationToken: uuidv4(),
    });

    const msg = {
      to: email,
      from: "o.alexey1202@gmail.com",
      subject: "Email verification",
      html: `<a href="http://localhost:3000/api/users/verify/${newUser.verificationToken}">Please verify your email</a>`,
    };
    await sgMail.send(msg);

    res.status(201).send({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    return res.send(error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).send({
        message: "Email or password is wrong",
      });
    }

    const isPasswordValid = comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Email or password is wrong",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        token: jwtSign({ _id: user._id }),
      },
      {
        new: true,
      }
    );

    res.status(201).send({
      token: updatedUser.token,
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  } catch (error) {
    return res.send(error.message);
  }
};

const logout = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        token: null,
      }
    );

    res.status(204).send(null);
  } catch (error) {
    return res.send(error.message);
  }
};

const current = async (req, res) => {
  try {
    return res.status(200).send({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    return res.send(error.message);
  }
};

const avatarsPatch = async (req, res) => {
  try {
    const pathTmpAvatar = `./tmp/${req.file.originalname}`;
    await fs.writeFile(pathTmpAvatar, req.file.buffer);

    const fileName = `avatar-${req.user.id}`;
    const fileType = req.file.mimetype.split("/")[1];
    const newPathAvatar = `./public/avatars/${fileName}.${fileType}`;

    await Jimp.read(pathTmpAvatar)
      .then((avatar) => {
        return avatar.resize(250, 250).write(newPathAvatar);
      })
      .catch((err) => {
        throw err;
      });

    const avatarURL = `avatars/${fileName}.${fileType}`;
    await User.findOneAndUpdate(
      {
        _id: req.user.id,
      },
      { avatarURL },
      {
        new: true,
      }
    );
    return res.status(200).send({
      avatarURL: avatarURL,
    });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};

const verifyUserToken = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    console.log("Verifying user token", verificationToken);

    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({
        message: `User not found`,
      });
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({
      message: "Verification successful",
    });
  } catch (error) {
    res.status(404).send({
      message: "User not found",
    });
  }
};

const resendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Email is wrong" });
    }
    if (user.verificationToken) {
      const msg = {
        to: email,
        from: "o.alexey1202@gmail.com",
        subject: "Email verification",
        html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Please verify your email</a>`,
      };
      await sgMail.send(msg);
    }
    if (user.verify) {
      return res.status(400).json({
        status: "failure",
        message: `Verification has already been passed`,
      });
    }

    return res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    res.status(400).send({
      message: "Verification has already been passed",
    });
  }
};

module.exports = {
  signUp,
  login,
  logout,
  current,
  avatarsPatch,
  verifyUserToken,
  resendEmail,
};
