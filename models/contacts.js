const Contact = require("../models/contact.model");

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    return res.status(200).json(contacts);
  } catch (error) {
    return res.send(error.message);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contactbyId = await Contact.findById(req.params.contactId);
    if (contactbyId) return res.status(200).json(contactbyId);
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    return res.send(error.message);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const result = await Contact.findByIdAndRemove(req.params.contactId);
    if (result) return res.status(200).json({ message: "contact deleted" });
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    return res.status(404).send(error.message);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      const contact = await Contact.create({
        name,
        email,
        phone,
        owner: req.user,
      });
      res.status(201).json(contact);
    }
  } catch (error) {
    return res.send(error.message);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const updateContact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      {
        new: true,
      }
    );
    if (updateContact) return res.status(200).json(updateContact);
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    return res.status(404);
  }
};

const updateStatusContact = updateContact;

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
