const express = require('express');
const router = express.Router();
const Product = require('../models/product_model');


const cloudinary = require('cloudinary').v2;


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret:process.env.api_secret
});



// API endpoint for creating a new product with image upload

router.post('/products', async(req, res) => {
  try {
    const file = req.files.picture;
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath
      , { folder: 'product_images' });
    console.log(uploadResult);

    const { name, price, mrp, description, quantity } = req.body;

    // Validate and sanitize user inputs here

    if (!name || !price || !mrp || !description || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct = new Product({
      name,
      price,
      mrp,
      description,
      quantity,
      picture: uploadResult.url,
    });

    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//....................................... API endpoint for getting all products

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//.................................APi endpoint for getting one product

router.get('/products/:_id', async (req, res) => {
  try {
    const productId = req.params._id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//......................... delete product 


router.delete('/products/:_id', async (req, res) => {
  try {
    // Check if the user is an admin
    const isAdmin = req.user && req.user.isAdmin;

    if (isAdmin===true) {
      return res.status(403).json({ error: 'Permission denied. Admin access required.' });
    }

    const productId = req.params._id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







module.exports = router;
