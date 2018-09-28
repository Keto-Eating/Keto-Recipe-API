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

// configuration ===============================================================
let mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true } ); //connect our database
mongoose.set('debug', true);


app.get('/', function(req, res) {
  res.send('Hello Keto!');
});


app.listen(port, () => {
  console.log(`Server listening on ${port} `)
});
