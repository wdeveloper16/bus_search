var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.name = "Bildernachweis";
	locals.section = 'bildernachweis';
	locals.title = "Bildernachweis";
	locals.noheader = true;
	locals.nosearch = true;
	locals.nofollow = true;

	
	view.on('init', function(next) {
		next();
	});

	// Render the view
	view.render('bildernachweis');
};
