const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');


//--Configure app
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'))


//--Routing
const apiRouter = require('./route/api');
const infoRouter = require('./route/info');
app.use('/api', apiRouter);
app.use('/info', infoRouter);

if (process.env.NODE_ENV === 'production') {
  //Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  //Handle React routing, return all get requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

//Catch any other requests with 403 forbidden
app.use(function(req, res, next) {
  next(createError(403));
});


//--Error handling
app.use(function(err, req, res, next) {
  //Logging error
  console.error(err.stack)

  //Render the error page
  res.locals.title = process.env.npm_package_name //The locals are for the "Pug" template
  res.locals.err = err;
  res.status(err.status || 500);
  res.render(path.join(__dirname, 'view/error.pug'));
});


//--Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
