const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const fs   = require('fs');

const CONFIG = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
const dbOps = require('../module/db-ops'); //The path in require start from this file; the path in the code starts from project root


//api/
router.get('/template', (req, res) => {
  res.download('./file/criterion-template.xlsx', 'criterion-template.xlsx'); //Express will catch and process error in sync code
});

router.get('/demo', (req, res, next) => {
  //Plain version 5bfb6a51bc4c4763540525cf
  //Short version 5bffacbebcfacd21fce8563c
  //Long version 5bffb14ffaca310e183c503c
  dbOps.getCompare("5bffacbebcfacd21fce8563c")
    .then((data) => {res.send(data);})
    .catch(next); //Async error has to be manually dealt. Will be dealt with the centralized err handler in `server.js`
});

router.get('/record/:id', (req, res, next) => {
  dbOps.getCompare(req.params.id)
    .then((data) => {res.send(data);})
    .catch(next);
});

router.post('/create', (req, res, next) => {
  dbOps.postCompare(req.body)
    .then((insertedId) => {
      let url = process.env.NODE_ENV === 'production' ? CONFIG.hostUrl + 'record/' : 'localhost:3000/record/';
      res.send(url + insertedId);
    })
    .catch(next);
});


module.exports = router;