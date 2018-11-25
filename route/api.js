const express = require('express');
const router = express.Router();

const dbOps = require('../module/dbOps');


//api/
router.get('/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });

  // dbOps.postCompare();
});

router.post('/world', (req, res) => {
  console.log(req.body)
  res.send(
    `I received your POST request. This is what you sent me: ${req.body}`,
  );
});


module.exports = router;