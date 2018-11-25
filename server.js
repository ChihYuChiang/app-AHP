const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const apiRouter = require('./route/api');
app.use('/api', apiRouter);


app.listen(port, () => console.log(`Listening on port ${port}`));
