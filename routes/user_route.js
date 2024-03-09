const express = require('express');
const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const protectedRoute = require ('../middleware/protectedResource');

const UserModel = mongoose.model('UserModel');
const router = express.Router();

// .............................. {  SignUp Api  } .................................................. 

router.post("/signup", async (req, res) => {
    try {
        const { firstname, lastname, mobilenumber, address, email, password, isAdmin } = req.body;

        // Check if any mandatory field is missing
        if (!firstname || !lastname || !email || !password || !mobilenumber || !address) {
            return res.status(400).json({ error: "One or more mandatory fields are empty" });
        }

        // Check if a user with the provided email already exists in the database
        const userInDB = await UserModel.findOne({ email: email });

        if (userInDB) {
            return res.status(500).json({ error: "User with this email already exists" });
        }

        // Hash the user's password before storing it in the database
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Create a new user instance with the hashed password and isAdmin flag
        const user = new UserModel({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            address,
            mobilenumber,
            isAdmin: isAdmin || false, // Set isAdmin to true only if provided, default to false
        });

        // Save the new user to the database
        const newUser = await user.save();

        res.status(200).json({ result: "User signed up successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); 
//................................{get all user }.......................................................
// Assuming your protectedRoute middleware sets user information in req.user

router.get("/users", protectedRoute, async (req, res) => {
    try {
      // Check if the user is an admin
      if (req.user.isAdmin===false) {
        return res.status(403).json({ error: 'Permission denied. Admin access required.' });
      }

      // Fetch all users from the database
      const allUsers = await UserModel.find({}, { password: 0 });
  
      res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});


// .............................. {  Login  Api  } .................................................. 

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
 // Check if any mandatory field is missing
        if (!email || !password) {
            return res.status(400).json({ error: "One or more mandatory fields are empty" });
        }
   // Find the user with the provided email in the database
        const userInDB = await UserModel.findOne({ email: email });
// If the user does not exist, return an authentication error
        if (!userInDB) {
            return res.status(401).json({ error: "Invalid Email" });
        }
  // Compare the provided password with the hashed password stored in the database
        const didMatch = await bcryptjs.compare(password, userInDB.password);

        if (didMatch) {
      // If the passwords match, generate a JWT token for authentication
            const jwtToken = jwt.sign({_id: userInDB._id} , JWT_SECRET);
             // Extract relevant user information for the response
            const userInfo = {"email": userInDB.email , "firstname": userInDB.firstname , "lastname": userInDB.lastname,"isAdmin": userInDB.isAdmin};

            res.status(200).json({ result: {token : jwtToken,userInfo}});
        } else {
            res.status(401).json({ error: "Invalid Password" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//..........................{get user who logged in }..................................................................

router.get("/userinfo", protectedRoute, async (req, res) => {
    try {
        // Access user information from the authenticated request
        const user = req.user;

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//..........................{ Update User Info }..................................................................

router.put("/userinfo/update", protectedRoute, async (req, res) => {
    try {
        // Access user information from the authenticated request
        const userId = req.user._id;
        
        // Get updated user information from the request body
        const { firstname, lastname, mobilenumber, address, email } = req.body;

        // Find the user in the database by user ID
        const userInDB = await UserModel.findById(userId);

        // If the user does not exist, return an error
        if (!userInDB) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update the user information
        userInDB.firstname = firstname;
        userInDB.lastname = lastname;
        userInDB.mobilenumber = mobilenumber;
        userInDB.address = address;
        userInDB.email = email;

       

        // Save the updated user to the database
        await userInDB.save();

        res.status(200).json({ result: "User information updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//...............................................................................................
// ..........................{ Update Password }..................................................................
router.put("/userinfo/update-password", protectedRoute, async (req, res) => {
    try {
        // Access user information from the authenticated request
        const userId = req.user._id;
       
        // Get current and new password from the request body
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "One or more mandatory fields are empty" });
        }
        // Find the user in the database by user ID
        const userInDB = await UserModel.findById(userId);

        // If the user does not exist, return an error
        if (!userInDB) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the current password provided matches the one in the database
        const isPasswordValid = await bcryptjs.compare(currentPassword, userInDB.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid current password" });
        }

        // Hash the new password before updating
        const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

        // Update the user's password
        userInDB.password = hashedNewPassword;

        // Save the updated user to the database
        await userInDB.save();

        res.status(200).json({ result: "Password updated successfully" });
    } catch (error) {
        console.error(error); // Log the error for debugging

      
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        
    }
});

//.................................................................


router.patch('/users/:id', protectedRoute, async (req, res) => {
    try {
      const { id } = req.params;  
      const { isAdmin } = req.body;
  
      // Update the user's isAdmin status in the database
      const updatedUser = await UserModel.findByIdAndUpdate(id, { isAdmin }, { new: true });
  
      // Check if the user exists
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'Admin status updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating admin status:', error);
  
      // Send an error response with a meaningful message
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

//...................................................................................................


// Delete User by ID
router.delete('/users/:_id', protectedRoute, async (req, res) => {
    try {
        const isAdmin = req.user && req.user.isAdmin;

        if (!isAdmin) {
            return res.status(403).json({ error: 'Permission denied. Admin access required.' });
        }

        const { _id } = req.params;

        const userToDelete = await UserModel.findById(_id);

        if (!userToDelete) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use deleteOne to remove the user
        await UserModel.deleteOne({ _id: userToDelete._id });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  

module.exports = router;
