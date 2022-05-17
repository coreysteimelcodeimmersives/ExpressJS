var express = require('express');
var router = express.Router();

/* GET datetime listing. */
router.get('/', function(req, res, next) {
  res.send(date.toString());
});

module.exports = router;

/* HELPER Functions */
let date = new Date();


