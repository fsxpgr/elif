var express = require('express');
var router = express.Router();
var db = require('./../db/rethink');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('company_info');
});

module.exports = router;
