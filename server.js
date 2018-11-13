require('dotenv').config();
const exp = require('express');

const app = exp();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
// const passport = require('passport'); // Authentication
// const flash = require('connect-flash'); // messages


// MIDDLEWARE configuration ============================================================
// set up our express application
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json
app.use(bodyParser.json());

// TEMPLATE configuration ===============================================================
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require("handlebars-helpers")()
}));
app.set('view engine', 'hbs');


// Static content
app.use(exp.static('./public'));

// Database configuration ==============================================================
const mongoose = require('mongoose');
const dbConfig = require('./src/config/database');

mongoose.connect(dbConfig.uri, {
  useNewUrlParser: true
}); // connect our database
mongoose.set('debug', true);


// routes =============================================================================
// load our routes and pass to our app
require('./controllers/recipes')(app);
require('./controllers/users')(app); // load our routes and pass to our app
require('./controllers/favorites')(app); // load our routes and pass to our app
require('./controllers/dashboard')(app);


// 404 page
app.get('*', (req, res) => {
  res.render('error/index');
});


// launch =============================================================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Keto server listening on ${PORT}`);
});

// We export the app so the tests have access to the server
module.exports = app;
