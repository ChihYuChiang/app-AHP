const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const fs   = require('fs');

const CONFIG = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
const dbOps = require('../module/dbOps'); //The path in require start from this file; the path in the code starts from project root


//api/
router.get('/hello', (req, res) => {
  res.send({ express: 'The analytic hierarchy process (AHP) is a structured technique for organizing and analyzing complex decisions, based on mathematics and psychology. It was developed by Thomas L. Saaty in the 1970s and has been extensively studied and refined since then.' });
});

router.get('/template', (req, res) => {
  res.download('./file/criterion-template.xlsx', 'criterion-template.xlsx');
});

router.get('/demo', (req, res) => {
  //Plain version 5bfb6a51bc4c4763540525cf
  dbOps.getCompare("5bfe91c168bf4cd8cca7f18f")
    .then((data) => {res.send(data);});
});

router.get('/record/:id', (req, res) => { //TODO: handle error (no record)
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