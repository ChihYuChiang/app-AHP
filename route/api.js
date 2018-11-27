const express = require('express');
const router = express.Router();

const dbOps = require('../module/dbOps'); //The path in require start from this file; the path in the code starts from project root


//api/
router.get('/hello', (req, res) => {
  res.send({ express: 'The analytic hierarchy process (AHP) is a structured technique for organizing and analyzing complex decisions, based on mathematics and psychology. It was developed by Thomas L. Saaty in the 1970s and has been extensively studied and refined since then.' });
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