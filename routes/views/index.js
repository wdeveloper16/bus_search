var keystone = require('keystone');
var getSlug = require('speakingurl');
var Handlebars = require('handlebars');

exports = module.exports = function (req, res) {



    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'home';
    locals.title = "Fahrplan";
    locals.heading = "Abfahrt und Ankunft";
    locals.subline = "Finden Sie die aktuellen Fahrpläne mit Abfahrts- und Ankunftszeiten der größten Haltestellen Deutschlands";
    locals.keywords = "Fahrplan, Haltestelle, Bahnhof, Nahverkehr, Station, Ankunft, Abfahrt";
    locals.description = "Fahrplanauskunft (Abfahrt & Ankunft) und Haltestelleninfos für U-Bahn, S-Bahn, Regio, Straßenbahn und Bus";
    locals.statesJson = [];

    locals.data = {
        towns: [],
        states: [],
        featuredTowns: [
          {name: 'Berlin', url: 'berlin'}, 
          {name: 'Hamburg', url: 'hamburg'}, 
          {name: 'München', url: 'muenchen'}, 
          {name: 'Köln', url: 'koeln'}
        ],
        featuredStates: [
          {name: 'Nordrhein-Westfalen', url: 'nordrhein-westfalen'}, 
          {name: 'Bayern', url: 'bayern'}, 
          {name: 'Baden-Württemberg', url: 'baden-wuerttemberg'}, 
          {name: 'Niedersachsen', url: 'niedersachsen'}
        ]
        
    };
    locals.states = [];

    view.on('init', function (next) {

        var q1 = keystone.list('Stop').model.aggregate(
            {
                $match: {
                    "location.country": "Deutschland"
                }
            },
            {
                $group: {
                    _id: "$location.suburb", total: {$sum: 1}
                }
            },
            {
                $sort: {total: -1}
            },
            {
                $limit: 100
            }
        );
        q1.exec(function (err, results) {
            locals.data.towns = results;

            var q2 = keystone.list('Sbbstation').model.find()
                .select({ "name": 1, "sbId": 1});
            q2.exec(function (err, results) {
                locals.states = results;
                for(var i = 0; i < results.length; i++){
                    locals.statesJson.push({id:results[i].sbId, text:results[i].name});
                }
                locals.statesJson = JSON.stringify(locals.statesJson);
                next(err);
            });
        });

    });

    // Render the view
    view.render('index');
};
