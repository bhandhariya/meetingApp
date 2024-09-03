var express = require('express');
var router = express.Router();
const {staticUsers} = require('../utills/constant')



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json(staticUsers);
});

module.exports = router;
