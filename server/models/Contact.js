const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  // You might want to add a timestamp for when the message was received
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
