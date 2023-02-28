const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const express = require("express");

const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

const schema = Joi.object(
  {
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  },
  { abortEarly: false }
);

router.get("/", async (req, res, next) => {
  const allContacts = await listContacts();
  res.status(200).json(allContacts);
});

router.get("/:contactId", async (req, res, next) => {
  const contactbyId = await getContactById(req.params.contactId);
  if (contactbyId) {
    res.status(200).json(contactbyId);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", validator.body(schema), async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    const contact = await addContact(req.body);
    res.status(201).json(contact);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const statusCode = await removeContact(req.params.contactId);
  if (statusCode === 200) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", validator.body(schema), async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ message: "missing fields" });
  } else {
    const contact = await updateContact(req.params.contactId, req.body);
    if (contact === -1) res.status(404).json({ message: "Not found" });
    res.status(200).json(contact);
  }
});

module.exports = router;
