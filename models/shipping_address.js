const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

// Define the schema for the ShippingModel
const shippingAddressSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  mobilenumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalcode: {
    type: Number,
    required: true,
  },
  author: {
    type: ObjectId,
    ref: "UserModel",
  }
});
const ShippingModel = mongoose.model('ShippingModel', shippingAddressSchema);

module.exports = ShippingModel;