const exp = require('express');
const app = exp();
require('dotenv').config();
const mongoose = require('mongoose');

const passport = require('passport'); // Authentication
const flash = require('connect-flash'); // messages

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


// Port
const port = process.env.PORT;

// Database configuration ===============================================================
let mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true } ); //connect our database
mongoose.set('debug', true);


// routes ======================================================================
require('./controllers/users')(app); // load our routes and pass in our app



// launch ======================================================================
app.listen(port, () => { console.log(`Keto server listening on ${port} `) });
