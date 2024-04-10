// order_model.js
const mongoose = require('mongoose');

// Define the schema for orders
const orderSchema = new mongoose.Schema({
    // Information about the user who placed the order
    user: {
        // Email of the user
        email: {
            type: String,
            required: true,
        },
        // First name of the user
        firstname: {
            type: String,
            required: true,
        },
        // Last name of the user
        lastname: {
            type: String,
            required: true,
        },
    },
    // Line items in the order
    lineItems: [
        {
            // Price data for each item
            price_data: {
                // Currency of the price
                currency: {
                    type: String,
                    default: 'inr',
                },
                // Product data
                product_data: {
                    // Name of the product
                    name: String,
                },
                // Unit amount of the item
                unit_amount: Number,
            },
            // Quantity of the item
            quantity: Number,
        },
    ],
    // Payment ID associated with the order
    paymentId: {
        type: String,
        required: true,
    },
    // Information about the products in the order
    productinfo: {
        type: Array,
        required: true,
    },
});

// Create the Order model based on the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
