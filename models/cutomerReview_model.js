const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

// Define the schema for customer reviews
const CustomerReviewSchema = new mongoose.Schema({
    // Rating of the review
    rating: {
        type: String,
        required: true
    },
    // Comments provided by the reviewer
    comments: {
        type: String,
        required: true
    },
    // ID of the product being reviewed
    productId: {
        type: String,
        required: true
    },
    // Author of the review (reference to UserModel)
    author: {
        type: ObjectId,
        ref: "UserModel"
    }
}, { timestamps: true });

// Export the model based on the schema
module.exports = mongoose.model('customerReview', CustomerReviewSchema);
