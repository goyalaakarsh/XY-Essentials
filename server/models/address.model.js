const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User who owns the address
  fullName: { type: String, required: true },  // Recipient's name
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isDefault: { type: Boolean, default: false },  // Default shipping address
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
