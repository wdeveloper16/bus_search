var keystone = require('keystone');
var getSlug = require('speakingurl');
var middleware = require('../middleware');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.name = req.params.name;
    locals.section = 'mapstop';
    locals.title = "Stop Map";

    locals.data = {
        locations: [],
        center: [0, 0],
        stops: []
    };

    view.on('init', function (next) {

        var q1 = keystone.list('Stop').model.findOne()
            .where('url.name', locals.name);
        q1.exec(function (err, stop) {
            if (err) {
              next(err);
              return;
            }
            if (!stop) {
              res.notfound();
              return;
            }

            var point = stop.location.geo;
            var q2 = keystone.list('Stop').model.find()
                .where('location.suburb', stop.location.suburb)
                .where('location.geo')
                .near({
                    center: {type: 'Point', coordinates: point}
                })
                .limit(11);
            q2.exec(function (err, results) {
                if (err || !results) {
                  next(err);
                  return;
                }
                locals.data.stops = results;


                for (var i = 0; i < results.length; i++) {
                    var letter = String.fromCharCode("A".charCodeAt(0) + i);
                    locals.data.stops[i].letter = letter;
                    if (i == 0)
                        locals.data.stops[i].distance = 0;
                    else
                        locals.data.stops[i].distance = middleware.calcDistance(
                            locals.data.stops[i].location.geo[1],
                            locals.data.stops[i].location.geo[0],
                            locals.data.stops[0].location.geo[1],
                            locals.data.stops[0].location.geo[0]
                        ).toFixed(2);
                    var url = getSlug(results[i].location.name);
                    var infoname = results[i].location.name.replace("\"", "\\\"");
                    var infostreet = results[i].location.street1.replace("\"", "\\\"");
                    var point = {
                        info: "<strong>" + infoname + "</strong><br>" +
                        infostreet + "<br>" +
                        "<a href = \"/" + url + "\">Link</a>",
                        lat: results[i].location.geo[1],
                        long: results[i].location.geo[0]
                    };
                    locals.data.locations.push([point.info, point.lat, point.long, i]);
                    locals.data.center[0] += results[i].location.geo[1];
                    locals.data.center[1] += results[i].location.geo[0];
                }
                locals.data.center[0] /= results.length;
                locals.data.center[1] /= results.length;
                next(err);
            });
        });

    });

    // Render the view
    view.render('mapStop', {layout: ''});
};

