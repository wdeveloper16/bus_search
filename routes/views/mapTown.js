var keystone = require('keystone');
var getSlug = require('speakingurl');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.name = req.params.name;
	locals.section = 'maptown';
	locals.title = "Town Map";

	locals.data = {
		locations: [],
		center: [0,0]
	};

	view.on('init', function(next) {
		
		var q = keystone.list('Stop').model.find()
			.where('url.suburb', locals.name)
			.sort('-weight');

		q.exec(function(err, results) {
			if (err || !results) {
				next(err);
				return;
			}
			if (results.length == 0) {
				res.notfound();
				return;
 			}
			locals.data.stops = results;
			for (var i=0;i<results.length;i++) {
				var url = getSlug(results[i].location.name);
				var infoname = results[i].location.name.replace("\"", "\\\"");
				var infostreet = results[i].location.street1.replace("\"", "\\\"");
	      var point = {
  	    	info: "<strong>"+infoname+"</strong><br>" +
    	  				infostreet + "<br>" + 
      					"<a href = \"/" + url + "\">Link</a>",
      		lat: results[i].location.geo[1],
	      	long: results[i].location.geo[0]
				};
				locals.data.locations.push([point.info, point.lat, point.long, i]);
				locals.data.center[0]+=results[i].location.geo[1];
				locals.data.center[1]+=results[i].location.geo[0];
			}
			locals.data.center[0] /= results.length;
			locals.data.center[1] /= results.length;
			next(err);
		});
		
	});

	// Render the view
	view.render('mapTown',{layout:''});
};
