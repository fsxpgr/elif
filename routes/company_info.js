var express = require('express');
var router = express.Router();
var db = require('./../db/rethink');

/* GET home page. */
router.get('/:id', (req, res, next) => {
  db.companyInfo(req.params.id, function(e){
      console.log(e)    
    res.render('company_info',{ companies: e });
  })
});

module.exports = router;
