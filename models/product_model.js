const mongoose = require('mongoose');

// Define the schema for products
const productSchema = new mongoose.Schema({
    // Name of the product
    name: {
        type: String,
        required: true
    },
    // Price of the product
    price: {
        type: Number,
        required: true
    },
    // Maximum retail price of the product
    mrp: {
        type: Number,
        required: true
    },
    // Description of the product
    description: {
        type: String,
        required: true
    },
    // Quantity of the product available
    quantity: {
        type: Number,
        required: true
    },
    // Picture URL of the product
    picture: {
        type: String,
        required: true
    },
    // Size of the product (if applicable)
    size: {
        type: String,
       
    },
    category: {
        type: String,
      
    }
}, { timestamps: true });

// Create the Product model based on the schema
module.exports = mongoose.model('Product', productSchema);
