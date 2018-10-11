require('dotenv').config();
const exp = require('express');

const app = exp();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('https');
// const passport = require('passport'); // Authentication
// const flash = require('connect-flash'); // messages

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;


// MIDDLEWARE configuration ============================================================
// set up our express application
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
})); // get information from forms

// TEMPLATE configuration ===============================================================
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs'
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
require('./controllers/users')(app); // load our routes and pass to our app
require('./controllers/recipe')(app); // load our routes and pass to our app

app.get('/', (req, res) => {
  res.render('index');
});

// app.get('/', (req, res) => {
//   // console.log(req.query);
//   // console.log(req.query.term)
//   const queryString = `keto ${req.query.term}`;
//   // ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
//   const term = encodeURIComponent(queryString);
//   // PUT THE SEARCH TERM INTO THE EDEMAM API SEARCH URL
//   const url = `https://api.edamam.com/search?q=${term}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`;
//   // console.log(`URL: ${url}`);
//   http.get(url, (response) => {
//     response.setEncoding('utf8');
//     let body = '';
//
//     response.on('data', (d) => {
//       // CONTINUOUSLY UPDATE STREAM WITH DATA FROM EDEMAM
//       body += d;
//     });
//
//     response.on('end', () => {
//       // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
//       const parsed = JSON.parse(body);
//       // console.log(parsed.hits[0].recipe.image); // <-- Confirmed this shows the correct data!!!! -->
//       //  Index Template & pass recipe data into the template
//       res.render('index', { recipes: parsed.hits });
//     });
//   });
// });

// launch =============================================================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Keto server listening on ${PORT}`);
});
