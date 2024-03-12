// payment_route.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51N7vdjSD3r9BRhLabKEqrJQkVRJadWmdFpdUX5k1agIJoWgFlgddM1xkjsD1w5AfEIqAlOlO2FbLJHyQIdvuJbuj001In21biE'); // Replace with your actual Stripe secret key
const Order = require('../models/order_model');

router.post('/create-checkout-session', async (req, res) => {
  const { products, user } = req.body;
  // console.log(products);
  // console.log(user);
  const lineItems = products.map((product) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: product.name,
        
      },
      unit_amount: product.price * 100,
    },
    quantity: product.counter
  }));

  // console.log(lineItems);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `http://localhost:3000/success?paymentId={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:3000/cancel",
  });

  const order = new Order({
    user: user,
    lineItems: lineItems,
    productinfo: products,
    paymentId: session.id,
  });

  await order.save();

  res.json({ id: session.id });
});


//......................................{ Find the order by payment ID}.............................................................................

router.get('/get-order-by-payment-id/:paymentId', async (req, res) => {
    try {
      const paymentId = req.params.paymentId;
    console.log(paymentId);
      
      const order = await Order.findOne({ paymentId });
    
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
    
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
module.exports = router;
