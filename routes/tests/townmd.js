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

	locals.breadcrumbs = [];
	locals.data = {
		stops: []
	};
	
	locals.currUrl = middleware.fullUrl(req);
	view.on('init', function(next) {
		var q = keystone.list('Stop').paginate({
				page: req.query.page || 1,
				perPage: 100,
				maxPages: 5,
				filters: {'url.suburb': locals.name}
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
			locals.data.stops = results;
			var halflen = Math.floor(results.results.length/2);
			locals.data.stopsright = results.results.slice(0);
			locals.data.stopsleft = locals.data.stopsright.splice(0,halflen);
			var ix = 0;
			var firststop = results.results[ix];
			if (firststop.location.country == "Deutschland") {
				while(firststop.location.state == "n/a" || firststop.location.state == "") {
					ix++;
					if (ix >= results.results.length)
						break;
					firststop = results.results[ix];				}
				locals.breadcrumbs.push({url:"/bundesland/"+getSlug(firststop.location.state), name: firststop.location.state});
			} else {
				locals.breadcrumbs.push({url:"/land/"+getSlug(firststop.location.country), name: firststop.location.country});
			}
			var name = firststop.location.suburb;
			locals.title = name + " - Bahnhöfe und Stationen";
			locals.heading = "Fahrplan, Haltestellen und Stationen in " + name;
			locals.keywords = "Fahrplan, Haltestelle, Station, Nahverkehr, Ankunft, Abfahrt, " + name;
			locals.description = "Fahrplanauskunft (Abfahrt & Ankunft) und Haltesstelleninfos für " + name;
			locals.breadcrumbs.push({url: "/stadt/"+locals.name, name: name});
			
			next(err);
		});
		
	});

	// Render the view
  view.render('tests/town');
};
