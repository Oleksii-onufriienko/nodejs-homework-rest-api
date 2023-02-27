const fs = require("fs/promises");
const path = require("path");
const shortid = require("shortid");

const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactsList = JSON.parse(contacts);
    console.table(contactsList);
    return contactsList;
  } catch (error) {
    return error.message;
  }
};

const getContactById = async (contactId) => {
  try {
    const stringId = contactId.toString();
    const contacts = await fs.readFile(contactsPath);
    const contactsList = JSON.parse(contacts);
    const contact = contactsList.find((contact) => contact.id === stringId);
    return contact;
  } catch (error) {
    return error.message;
  }
};

const removeContact = async (contactId) => {
  try {
    const findContact = await getContactById(contactId);
    if (findContact) {
      const stringId = contactId.toString();
      const contacts = await fs.readFile(contactsPath);
      const contactsList = JSON.parse(contacts);
      const newContactsList = contactsList.filter(
        (contact) => contact.id !== stringId
      );
      await fs.writeFile(contactsPath, JSON.stringify(newContactsList));
      return 200;
    } else return 404;
  } catch (error) {
    return 404;
  }
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactsList = JSON.parse(contacts);
    const newContact = { id: shortid.generate(), name, email, phone };
    const newContactsList = [...contactsList, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(newContactsList));
    return newContact;
  } catch (error) {
    return error.message;
  }
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  try {
    const stringId = contactId.toString();
    const contacts = await fs.readFile(contactsPath);
    const contactsList = JSON.parse(contacts);

    const idx = contactsList.findIndex((contact) => contact.id === stringId);
    if (idx === -1) return -1;
    const newContactsList = contactsList.map((contact) => {
      if (contact.id === stringId) {
        return { id: contact.id, name, email, phone };
      } else {
        return contact;
      }
    });

    await fs.writeFile(contactsPath, JSON.stringify(newContactsList));
    return { id: stringId, name, email, phone };
  } catch (error) {
    return 404;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
