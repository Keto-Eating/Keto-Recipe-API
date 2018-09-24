const exp = require('express');
const app = exp();
const mongoose = require('mongoose');


// Port
const port = 3001;



app.get('/', function(req, res) {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server listening on ${port} `)
});
