//imports 
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

router.post('/products', async(req, res) => {
  try {
    const file = req.files.picture;
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, { folder: 'product_images' });
    console.log(uploadResult);

    const { name, price, mrp, description, quantity, size, category } = req.body;

    // Validate and sanitize user inputs here

    if (!name || !price || !mrp || !description || !quantity || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct = new Product({
      name,
      price,
      mrp,
      description,
      quantity,
      picture: uploadResult.url,
      size,
      category
    });

    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//....................................... API endpoint for getting all products........................................

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//.................................APi endpoint for getting one product.....................................................

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

//......................... delete product........................................................................... 


router.delete('/products/:_id', async (req, res) => {
  try {
    // Check if the user is an admin
    const isAdmin = req.user && req.user.isAdmin;

    if (isAdmin===false) {
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


router.put('/products/:id', async (req, res) => {
  try {
    const { name, price, mrp, description, quantity, picture, size, category } = req.body;
    const productId = req.params.id;

    // Validate and sanitize user inputs here

    if (!name || !price || !mrp || !description || !quantity || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product fields
    product.name = name;
    product.price = price;
    product.mrp = mrp;
    product.description = description;
    product.size = size;
    product.quantity = quantity;
    product.picture = picture || product.picture; // Update the picture only if provided
    product.category = category; // Update the category

    // Save the updated product
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/searchproducts', async (req, res) => {
  try {
    const { query } = req.query; // Extract the 'query' parameter from the request query string

    let products;
    if (query) {
      // If there's a query parameter, perform a case-insensitive search for products whose name or description matches the query
      products = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      });
    } else {
      // If no query parameter is provided, return all products
      products = await Product.find();
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
