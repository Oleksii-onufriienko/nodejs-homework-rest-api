var jwt = require("jsonwebtoken");

const jwtSign = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const jwtVerify = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  jwtSign,
  jwtVerify,
};
