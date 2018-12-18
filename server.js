const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');


const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'))


const apiRouter = require('./route/api');
const infoRouter = require('./route/info');
app.use('/api', apiRouter);
app.use('/info', infoRouter);


if (process.env.NODE_ENV === 'production') {
  //Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  //Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


app.listen(port, () => console.log(`Listening on port ${port}`));
