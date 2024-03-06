const mongoose = require('mongoose');

// Define the schema for the UserModel
const userSchema = new mongoose.Schema({
          firstname: {
                    type: String,
                    required: true
          },
          lastname: {
                    type: String,
                    required: true
          },
          mobilenumber: {
                    type: Number,
                    required: true
          },
          address: {
                    type: String,
                    required: true
          },
          email: {
                    type: String,
                    required: true
          },
          password: {
                    type: String,
                    required: true
          } ,
           isAdmin: {
                    type: Boolean,
                    default: false, // Set default value to false
                },
})

mongoose.model('UserModel',userSchema);
