var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var rgx = new RegExp("^" + req.query.query, "i");
	var q = keystone.list('Stop').model.distinct("location.name", {"location.name":{$regex:rgx}});
	q.exec(function(err, results) {
		res.send(results.sort());
	});

};