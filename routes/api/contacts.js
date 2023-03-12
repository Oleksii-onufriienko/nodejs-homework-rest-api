const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");
const { isAuthorized } = require("../../utils/isauthorized.util");

const express = require("express");

const routerContacts = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

const schemaAddContact = Joi.object(
  {
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
  },
  { abortEarly: false }
);

const schemaUpdateContact = Joi.object(
  {
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  },
  { abortEarly: false }
);

const schemaUpdateFavoritContact = Joi.object(
  {
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.boolean().required(),
  },
  { abortEarly: false }
);

routerContacts.get("/", isAuthorized, listContacts);

routerContacts.get("/:contactId", isAuthorized, getContactById);

routerContacts.post(
  "/",
  isAuthorized,
  validator.body(schemaAddContact),
  addContact
);

routerContacts.delete("/:contactId", isAuthorized, removeContact);

routerContacts.put(
  "/:contactId",
  isAuthorized,
  validator.body(schemaUpdateContact),
  updateContact
);

routerContacts.put(
  "/:contactId/favorite",
  isAuthorized,
  validator.body(schemaUpdateFavoritContact),
  updateStatusContact
);
module.exports = routerContacts;
