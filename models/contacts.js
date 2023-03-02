const Contact = require("../models/contact.model");

const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    return error.message;
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    return error.message;
  }
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndRemove(contactId);
    if (result) return 200;
    else return 404;
  } catch (error) {
    return 404;
  }
};

const addContact = async (body) => {
  try {
    const newContact = await Contact.create(body);
    return newContact;
  } catch (error) {
    return error.message;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const updateContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return updateContact;
  } catch (error) {
    return 404;
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
