const express = require('express');
const router = express.Router();
const { submitContactForm, getAllContacts } = require('./contact.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public: submit contact form
router.post('/', submitContactForm);

// Admin-only: get all messages
router.get('/', verifyAdminToken, getAllContacts);

module.exports = router;
