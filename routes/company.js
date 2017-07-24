var express = require('express');
var router = express.Router();
var db = require('./../db/rethink');

router.get('/',(req,res,next)=>{
    res.render("company",{type:"parent"});
})

router.get('/:id',(req,res,next)=>{
    db.getCompany(req.params.id,(data)=>{
        console.log(data);
        res.render("company",{type:"exist",data:data})
    })
})


router.get('/from_parent/:id',(req,res,next)=>{
    res.render("company",{type:"child",id:req.params.id});
})

router.post('/new/:id',(req,res,next)=>{
    db.addChild(req.params.id,req.body,(e)=>{
        db.getCompany(e.generated_keys[0],(e)=>{
            db.updateCash(e,0,()=>{
                res.redirect('/');
            })
        })
    })
})

router.post('/new',(req,res,next)=>{
    db.addCompany(req.body.name, req.body.cash, req.body.desc, req.body.location, req.body.tel_num, /*req.body.img,*/(e)=>{
        res.redirect('/');
    });
})

router.post('/:id',(req,res,next)=>{
    if (req.body.submit == "Delete") {
        db.getCompany(req.params.id,(e)=>{
            db.updateCashAfterDelete(e,()=>{
                db.deleteCompany(req.params.id,()=>{
                    res.redirect('/');
                });
            })
        })

    } else if (req.body.submit == "Update") {
        db.getCompany(req.params.id,(e)=>{
            var x = e.cash;
            db.updateCompany(req.params.id,req.body,()=>{
                db.getCompany(req.params.id,(e)=>{
                    db.updateCash(e,x,()=>{
                        res.redirect('/');
                    })
                })
            });
        })

    }
})



router.get('/company_info',(req,res,next)=>{
    res.render("company_info");
})




module.exports = router;