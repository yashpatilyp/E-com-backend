const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const customerReview = mongoose.model('customerReview');
const protectedRoute = require ('../middleware/protectedResource');




router.post('/api/review', protectedRoute, (req, res) => {
    const { rating, comments, productId } = req.body;

    // Check if any required field is missing
    if (!rating || !comments || !productId) {
        return res.status(400).json({ error: "One or more fields are empty" });
    }

    // Remove password from the user object in the request (if it exists)
    req.user.password = undefined;

    // Create a new review object using the customerReview schema
    const reviewObj = new customerReview({
        rating: rating,
        comments: comments,
        author: req.user,
        productId: productId, // Associate the review with the specified product
    });

    reviewObj.save()
        .then((newReview) => {
            res.status(200).json({ review: newReview });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

///........... Define a route to fetch reviews for a specific product without requiring login

router.get('/api/reviews/:productId', (req, res) => {
    const productId = req.params.productId;

    // Retrieve all reviews for the specified product from the database
    customerReview.find({ productId: productId })
    .sort({ createdAt: -1 })
        .populate('author', '-password') // Exclude the password field from the author object
        .then(reviews => {
            // If reviews are found, send them in the response
            res.status(200).json({ reviews });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


module.exports =router;