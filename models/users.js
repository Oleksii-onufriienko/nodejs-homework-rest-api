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
    });

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

module.exports = {
  signUp,
  login,
  logout,
  current,
};
