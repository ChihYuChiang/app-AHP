const express = require('express');
const router = express.Router();

const dbOps = require('../module/dbOps'); //The path in require start from this file; the path in the code starts from project root


//api/
router.get('/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

router.get('/template', (req, res) => {
  res.download('./ref/criterion-template.xlsx', 'criterion-template.xlsx');
});

router.get('/demo', (req, res) => {
  dbOps.getCompare("5bfb6a51bc4c4763540525cf")
    .then((data) => {res.send(data);});
});

router.post('/world', (req, res) => {
  res.send(`I received your POST request. This is what you sent me: ${req.body}`);
});


module.exports = router;