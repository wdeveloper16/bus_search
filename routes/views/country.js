var keystone = require('keystone');
var getSlug = require('speakingurl');
var middleware = require('../middleware');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.name = req.params.name;
	locals.section = 'town';
	locals.title = locals.name + " - Bahnhöfe und Stationen";
	locals.heading = "Fahrplan, Haltestellen und Stationen in " + locals.name;
	locals.keywords = "Fahrplan, Haltestelle, Station, Nahverkehr, Ankunft, Abfahrt, " + locals.name;
	locals.description = "Fahrplanauskunft (Abfahrt & Ankunft) und Haltesstelleninfos für " + locals.name;
	locals.breadcrumbs = [{url:"/land/"+locals.name, name: locals.name}];

	locals.data = {
		stops: []
	};
	locals.currUrl = middleware.fullUrl(req);

	view.on('init', function(next) {

		var q = keystone.list('Stop').paginate({
				page: req.query.page || 1,
				perPage: 100,
				maxPages: 5,
				filters: {'url.country': locals.name}
			})
			.sort({bdata: -1, weight:-1, 'location.name':1});
		q.exec(function(err, results) {
			if (err || !results) {
				next(err);
				return;
			}
			if (results.results.length == 0) {
				res.notfound();
				return;
 			}
			var name = results.results[0].location.country;
			locals.title = name + " - Bahnhöfe und Stationen";
			locals.heading = "Fahrplan, Haltestellen und Stationen in " + name;
			locals.keywords = "Fahrplan, Haltestelle, Station, Nahverkehr, Ankunft, Abfahrt, " + name;
			locals.description = "Fahrplanauskunft (Abfahrt & Ankunft) und Haltesstelleninfos für " + name;
			locals.breadcrumbs = [{url:"/land/"+locals.name, name: name}];
			locals.data.stops = results;
			var halflen = Math.floor(results.results.length/2);
			if (halflen < 50)
			  halflen = 50;
			locals.data.stopsright = results.results.slice(0);
			locals.data.stopsleft = locals.data.stopsright.splice(0,halflen);
			locals.name = name;
			next(err);
		});
		
	});

	// Render the view
	view.render('country');
};
