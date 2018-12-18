const express = require('express');
const router = express.Router();


//info/
router.get('/', (req, res) => {
  res.send(process.env.npm_package_version);
});


module.exports = router;