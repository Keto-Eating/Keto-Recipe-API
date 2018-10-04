require('dotenv').config();
const exp = require('express');

const app = exp();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
// const passport = require('passport'); // Authentication
// const flash = require('connect-flash'); // messages

// MIDDLEWARE configuration ===============================================================
// set up our express application
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })); // get information from forms

// TEMPLATE configuration ===============================================================
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');


// Static content
app.use(exp.static('./public'));

// Database configuration ===============================================================
const mongoose = require('mongoose');
const dbConfig = require('./src/config/database');

mongoose.connect(dbConfig.uri, { useNewUrlParser: true }); // connect our database
mongoose.set('debug', true);


// routes ======================================================================
require('./controllers/users')(app); // load our routes and pass in our app
const recipeController = require('./controllers/recipe')(app);
// app.use(recipeController);

app.get('/', (req, res) => {
    // res.send('docs/index.html')
});

// launch ======================================================================
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Keto server listening on ${port} `);
});
