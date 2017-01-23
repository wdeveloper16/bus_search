var keystone = require('keystone');
var getSlug = require('speakingurl');

exports = module.exports = function (req, res) {
	var name = req.body.timetable_user_input.name;
	var dt = req.body.timetable_user_input.date;
	var tm = req.body.timetable_user_input.time;
	var dir = req.body.timetable_user_input.direction;
	url = "/"+getSlug(name)+"?date="+dt+"&time="+tm+"&dir="+dir;
	res.redirect(url);
};