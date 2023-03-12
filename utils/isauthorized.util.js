const User = require("../models/user.model");
const { jwtVerify } = require("../utils/jwt.util");

const isAuthorized = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      message: "Not authorized",
    });
  }
  const decoded = jwtVerify(token);
  if (!decoded._id)
    return res.status(401).send({
      message: "Not authorized",
    });
  const user = await User.findOne({
    _id: decoded._id,
  });

  if (!user.token) {
    return res.status(401).send({
      message: "Not authorized",
    });
  }
  req.user = user;
  next();
};

module.exports = {
  isAuthorized,
};
