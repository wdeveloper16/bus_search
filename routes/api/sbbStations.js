var keystone = require('keystone');

exports = module.exports = function (req, res) {
    var rgx = new RegExp("^" + req.query.q, "i");
    var q = keystone.list('Sbbstation').model.find({"name":{$regex:rgx}});
    q.exec(function(err, results) {
        res.send(results);
    });
};