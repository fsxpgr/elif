var express = require('express');
var router = express.Router();
var db = require('./../db/rethink');

/* GET home page. */
router.get('/', (req, res, next) => {
  db.getCompanies((e)=>{
    res.render('index', { companies: e });
  })
});

module.exports = router;
