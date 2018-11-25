const express = require('express');
const router = express.Router();

const dbOps = require('../module/dbOps');


//api/
router.get('/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

router.post('/world', (req, res) => {
  res.send(
    `I received your POST request. This is what you sent me: ${req.body}`,
  );

  // dbOps.postCompare(req.body).then(() => {
  //   dbOps.getCompare("5bfa9fe98e4a664d14a69f10");
  // });
  dbOps.postCompare(req.body)
});


module.exports = router;