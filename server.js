require('dotenv').config();
const exp = require('express');

const app = exp();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const passport = require('passport'); // Authentication
// const flash = require('connect-flash'); // messages

// MIDDLEWARE configuration ===============================================================
// set up our express application
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })); // get information from forms


// Static content
app.use(exp.static('./public'));

// Database configuration ===============================================================
const mongoose = require('mongoose');
const dbConfig = require('./src/config/database');

mongoose.connect(dbConfig.uri, { useNewUrlParser: true }); // connect our database
mongoose.set('debug', true);


// routes ======================================================================
require('./controllers/users')(app); // load our routes and pass in our app


// launch ======================================================================
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Keto server listening on ${port} `);
});
