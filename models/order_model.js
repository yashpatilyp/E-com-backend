// order_model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        email: {
          type: String,
          required: true,
        },
        firstname: {
          type: String,
          required: true,
        },
        lastname: {
          type: String,
          required: true,
        },
       
      },
     

    lineItems: [
        {
            price_data: {
                currency: {
                    type: String,
                    default: 'inr',
                },
                product_data: {
                    name: String,
                },
                unit_amount: Number,
            },
            quantity: Number,
        },
    ],
    paymentId: {
        type: String,
        required: true,
    },

    productinfo: {
      type: Array, 
      required: true,
    },
  
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
