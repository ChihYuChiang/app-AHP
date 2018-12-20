const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const fs   = require('fs');

const CONFIG = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
const dbOps = require('../module/db-ops'); //The path in require start from this file; the path in the code starts from project root


//api/
router.get('/template', (req, res) => {
  res.download('./file/criterion-template.xlsx', 'criterion-template.xlsx');
});

router.get('/demo', (req, res) => {
  //Plain version 5bfb6a51bc4c4763540525cf
  //Short version 5bffacbebcfacd21fce8563c
  //Long version 5bffb14ffaca310e183c503c
  dbOps.getCompare("5bffacbebcfacd21fce8563c")
    .then((data) => {res.send(data);});
});

router.get('/record/:id', (req, res) => { //TODO: handle error https://nemethgergely.com/error-handling-express-async-await/
  dbOps.getCompare(req.params.id)
    .then((data) => {res.send(data);});
});

router.post('/create', (req, res) => {
  dbOps.postCompare(req.body)
    .then((insertedId) => {
      if (process.env.NODE_ENV === 'production') res.send(CONFIG.hostUrl + 'record/' + insertedId);
      else res.send('localhost:3000/record/' + insertedId); //Direct to the React server
    });
});


module.exports = router;