const { signUp, login, logout, current } = require("../../models/users");
const { isAuthorized } = require("../../utils/isauthorized.util");

const express = require("express");

const routerUsers = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

const schemaSignUpUser = Joi.object(
  {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
  { abortEarly: false }
);

routerUsers.post("/signup/", validator.body(schemaSignUpUser), signUp);

routerUsers.post("/login/", validator.body(schemaSignUpUser), login);

routerUsers.post("/logout/", isAuthorized, logout);

routerUsers.get("/current/", isAuthorized, current);

module.exports = routerUsers;
