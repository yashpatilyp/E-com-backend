const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const dotenv=require('dotenv').config();
const cors = require('cors');

const mongoose = require('mongoose');
const { MONGO_DB_URL } = require('./config');
const { JWT_SECRET } = require('./config');
const productRoutes = require('./routes/products');
const paymentRoutes = require('./routes/payment_route');
const fileUpload = require('express-fileupload');

// Set a port for your application
const port = process.env.PORT || 5000;
console.log(dotenv.parsed)
// Connect to MongoDB using the provided URL
mongoose.connect(MONGO_DB_URL);

// Get the database connection instance
const dbConnection = mongoose.connection;

// Event listeners for the database connection
dbConnection.on('connected', () => {
    console.log('DB connection established');
});

dbConnection.on('error', (error) => {
    console.error('Error while connecting to DB:', error.message);
});



app.use(cors());


app.use(fileUpload({
    useTempFiles: true
}))

// Parse incoming JSON requestss
app.use(express.json());

require('./models/user_model');

require('./models/cutomerReview_model');
require('./models/shipping_address')

app.use(require('./routes/user_route'));
app.use(require('./routes/cutomerReview'));
app.use(require('./routes/shipping_Address_route'));

app.use('/api', productRoutes);
app.use('/api', paymentRoutes); 
app.use('/api/orders', paymentRoutes);
app.use('/', express.static('uploads'))





// Start the server and listen on the specified port
app.listen (port , () => {

    console.log(`server listening on : ${port} `)

    
    });
