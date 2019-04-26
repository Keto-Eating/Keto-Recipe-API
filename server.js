/* eslint-disable global-require */
require('dotenv').config();
const exp = require('express');
const createError = require('http-errors');

const app = exp();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');


// MIDDLEWARE configuration ============================================================
// set up our express application
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true,
}));
// parse application/json
app.use(bodyParser.json());

// TEMPLATE configuration ===============================================================
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('handlebars-helpers')(),
}));
app.set('view engine', 'hbs');

// Static content
app.use(exp.static('./public'));

// Database configuration ==============================================================
const mongoose = require('mongoose');
const dbConfig = require('./src/config/database');

mongoose.connect(dbConfig.uri, {
  useNewUrlParser: true,
}); // connect our database
mongoose.set('debug', true);

// configure sessions ==================================================================

app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 3600000 },
  resave: true,
  saveUninitialized: true,
}));

// routes ==============================================================================
// set layout variables
app.use((req, res, next) => {
  // so we can check if user is logged in
  res.locals.user = req.session.user;
  next();
});

// routes =============================================================================
// load our routes and pass to our app
require('./controllers/recipes')(app);
require('./controllers/users')(app);
require('./controllers/favorites')(app);
require('./controllers/dashboard')(app);
require('./controllers/cart')(app);

// 404 page
app.get('*', (req, res) => {
  res.render('error/index');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => { // DO NOT REMOVE next
  // set locals, only providing error in development
  console.log('inside error handler!');
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error/index');
});

// launch =============================================================================
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Keto server listening on ${PORT}`);
});

// We export the app so the tests have access to the server
module.exports = app;
