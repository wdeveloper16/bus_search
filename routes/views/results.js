var keystone = require('keystone');
var request = require('request');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.name = "Results";
    locals.section = 'results';
    locals.title = "Results";
    locals.url = req.params.urlString;
    //
    // request('https://ticketsapi3:asesmoccal@crawler2api.com/searchSbb?' + locals.url, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //     }
    //     console.log(body);
    // });

    view.on('init', function(next) {
        next();
    });

    // Render the view
    view.render('results');
};
