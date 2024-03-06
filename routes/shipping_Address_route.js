const express = require('express');
const router = express.Router();
const ShippingModel = require('../models/shipping_address');
const protectedRoute = require('../middleware/protectedResource');

//.......................................{ Add Shipping Addresses }.................................................


router.post('/addShipping-Address', protectedRoute, async (req, res) => {
  try {
    const { fullname, mobilenumber, address, postalcode, city } = req.body;

    // Validate and sanitize user inputs here

    if (!fullname || !mobilenumber || !address || !postalcode || !city) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newShipping = new ShippingModel({
      fullname,
      mobilenumber,
      address,
      postalcode,
      city,
      author: req.user._id,
    });

    const savedShipping = await newShipping.save();

    const sanitizedUser = {
      _id: req.user._id,
      email: req.user.email,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      isAdmin: req.user.isAdmin,
    };

    res.json({ result: { savedShipping, userInfo: sanitizedUser } });
  } catch (error) {
    console.error('Error adding shipping address:', error);

    res.status(500).json({ error: 'Failed to add shipping address to the database' });
  }
});



//...................................{  get Shipping-Addresses  }.....................................................

//  getting all shipping addresses for the logged-in user
router.get('/getShipping-Addresses', protectedRoute, async (req, res) => {
  try {
    // Retrieve shipping addresses for the logged-in user
    const userShippingAddresses = await ShippingModel.find({ author: req.user._id });

    // Reverse the order of shipping addresses
    const reversedShippingAddresses = userShippingAddresses.slice().reverse();

    res.json({ shippingAddresses: reversedShippingAddresses });
  } catch (error) {
    console.error('Error getting shipping addresses:', error);
    res.status(500).json({ error: 'Failed to retrieve shipping addresses' });
  }
});


//........................................{ Update Shipping Address }..................................................................................


// Add a route to update a specific shipping address
router.put('/updateShipping-Address/:shippingId', protectedRoute, async (req, res) => {
          try {
            const { fullname, mobilenumber, address, postalcode, city } = req.body;
            const { shippingId } = req.params;
        
            // Validate and sanitize user inputs here
        
            const updatedShipping = await ShippingModel.findOneAndUpdate(
              { _id: shippingId, author: req.user._id },
              {
                $set: {
                  fullname,
                  mobilenumber,
                  address,
                  postalcode,
                  city,
                },
              },
              { new: true } // Return the modified document
            );
        
            if (!updatedShipping) {
              return res.status(404).json({ error: 'Shipping address not found or you do not have permission to update it' });
            }
        
            res.json({ result: updatedShipping });
          } catch (error) {
            console.error('Error updating shipping address:', error);
        
            res.status(500).json({ error: 'Failed to update shipping address' });
          }
        });

//.............................................................................................................

router.delete('/deleteAddress/:addressId', protectedRoute, async (req, res) => {
  try {
    const addressId = req.params.addressId;
    
    // Check if the address belongs to the logged-in user
    const addressToDelete = await ShippingModel.findOne({ _id: addressId, author: req.user._id });

    if (!addressToDelete) {
      return res.status(404).json({ error: 'Address not found or unauthorized' });
    }

    // Delete the address
    await ShippingModel.deleteOne({ _id: addressId });
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipping address:', error);
    res.status(500).json({ error: 'Failed to delete shipping address' });
  }
});
module.exports = router;
