r = require('rethinkdb');
var ref = r.table('companies');
var conn
r.connect({
    db: 'new', host:'nightfall.com.ua'
}, function(err, connection) {
    if (err) throw err;
    conn = connection;
});




var addCompany = (name, cash, desc, location, tel_num, /*img,*/ callback) => {//
        ref.insert({
            name: name,
            cash: cash,
            desc: desc,//
            location: location,//
            tel_num: tel_num,//
/*            img: img,//*/
            sum_cashe:null,
            parent_id: null
        }).run(conn, (err,res) => {
            return callback(res);
        })
}

var getCompanies = (callback) => {
    ref.run(conn,(err,cursor) => {
        if (cursor == undefined) {
            return callback(null);
        } else {
            cursor.toArray((err,res) => {
                res.forEach(function(element) { 
                }, this);
                return callback(res);
            })
        }
    })
}

var getCompany = (id,callback) => {
    ref.get(id).run(conn,(err,res)=>{
        return callback(res);
    })
}

var updateCompany = (id,e,callback) => {
    ref.get(id).update({
        name:e.name,
        cash:e.cash,
        desc: e.desc,//
        location: e.location,//
        tel_num: e.tel_num,//
       /* img: e.img,//*/
    }).run(conn,(err,res)=>{
        return callback();
    })
}

var deleteCompany = (id,callback) => {
    ref.get(id).delete().run(conn,(err,res)=>{
        return callback();
    })
}

var addChild = (id,data,callback) => {
    ref.insert({
        name: data.name,
        cash: data.cash,
        desc: data.desc,//
        location: data.location,//
        tel_num: data.tel_num,//
/*        img: data.img,//*/
        sum_cashe:null,
        parent_id: id
    }).run(conn,(err,res)=>{
        return callback(res);
    })
}

var updateCash = (data,cash,callback) => {
    getCompanies((e) =>{
        cursor(data,e,data,cash);
        save(e,()=>{
            return callback();
        });
    })
}

var updateCashAfterDelete = (data,callback) => {
    getCompanies((e) =>{
        cursor1(data,e,data);
        save(e,()=>{
            return callback();
        });
    })
}

var cursor1 = (data,e,old) => {
            if (data.id != old.id) {
                if (data.sum_cashe != null) {
                var sum = parseFloat(data.sum_cashe);
                } else {
                    var sum = parseFloat(data.cash);
                }
            } else {
                var sum = 0
            }
            
            e.forEach((item)=>{
                if (item.parent_id == data.parent_id && item.id != data.id) {
                    if (parseFloat(item.sum_cashe) > 0 && item.sum_cashe != null && item.sum_cashe != undefined) {
                        sum += parseFloat(item.sum_cashe);
                    } else {
                        sum += parseFloat(item.cash);
                    }
                }
            },this);
            e.forEach((item) =>{
                if (item.id == data.parent_id) {
                    item.sum_cashe = sum + parseFloat(item.cash);
                    return cursor1(item,e,old);
                }
            })
        }

var cursor = (data,e,old,cash) => {
            if (data.id != old.id) {
                if (data.sum_cashe != null) {
                    var sum = parseFloat(data.sum_cashe);
                } else {
                    var sum = parseFloat(data.cash);
                }
            } else {
                if (data.sum_cashe != null) {
                    data.sum_cashe = parseFloat(data.sum_cashe) + parseFloat(data.cash) - parseFloat(cash);
                    var sum = parseFloat(data.sum_cashe);
                } else {
                    var sum = parseFloat(data.cash);
                }
            }
            e.forEach((item)=>{
                if (item.parent_id == data.parent_id && item.id != data.id) {
                    if (parseFloat(item.sum_cashe) > 0 && item.sum_cashe != null && item.sum_cashe != undefined) {
                        sum += parseFloat(item.sum_cashe);
                    } else {
                        sum += parseFloat(item.cash);
                    }
                } else if (item.id == data.id) {
                    item.sum_cashe = data.sum_cashe;
                }
            },this);
            e.forEach((item) =>{
                if (item.id == data.parent_id) {
                    item.sum_cashe = sum + parseFloat(item.cash);
                    return cursor(item,e,old,cash);
                }
            })
        }
var save = (e,callback)=>{
    e.forEach((item,idx,arr)=>{
        if (idx != arr.length-1) {
            ref.get(item.id).update(item).run(conn,(err,res)=>{
            })
        } else {
            ref.get(item.id).update({
                sum_cashe:item.sum_cashe
            }).run(conn,(err,res)=>{
                return callback();
            })
        }
    },this)
}





var companyInfo = (id,callback) => {
    ref.get(id).run(conn,(err,res)=>{
        return callback(res);
    })
}



module.exports.getCompanies = getCompanies;
module.exports.addCompany = addCompany;
module.exports.getCompany = getCompany;
module.exports.updateCompany = updateCompany;
module.exports.deleteCompany = deleteCompany;
module.exports.addChild = addChild;
module.exports.updateCash = updateCash;
module.exports.updateCashAfterDelete =updateCashAfterDelete;
 module.exports.companyInfo = companyInfo;