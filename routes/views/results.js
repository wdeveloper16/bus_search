var keystone = require('keystone');
var request = require('request');
var Handlebars = require('handlebars');
var moment = require('moment');

Handlebars.registerHelper('ifCondNot', function (v1, v2, options) {
    if (v1 != v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('attr', function(name, data) {
    if(typeof target === 'undefined') target = "";

    var result = ' ' + name + '="' + data +  '" ';

    return new Handlebars.SafeString(result);
});

exports = module.exports = function (req, res) {


    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.name = "Results";
    locals.section = 'results';
    locals.title = "Results";
    locals.journeys = "";
    locals.url = req.params.urlString;
    locals.timeStart = req.params.timeStart;
    locals.timeEnd = req.params.timeEnd;
    locals.direct = req.params.direct;
    locals.duration = Number(req.params.duration.replace("duration:", ""));
    locals.price = Number(req.params.price.replace("price:", ""));
    locals.maxPrice = 0;
    locals.maxDuration = '';
    locals.changeDirect = 0;
    locals.change1 = 0;
    locals.change2 = 0;
    locals.topArr = '';
    locals.topDep = '';
    console.log(locals.price);




    request('https://ticketsapi3:asesmoccal@crawler2api.com/searchSbb?' + locals.url, function (error, response, body) {
        if (!error && JSON.parse(body)) {
            locals.journeys = JSON.parse(body).journeys;
            if (locals.journeys.length) {
                locals.topArr = locals.journeys[0].arr_name;
                locals.topDep = locals.journeys[0].dep_name;
                var timePattenr = 'HH:MM';
                var datePattenr = 'ddd DD MMM';
                for (var i = 0; i < locals.journeys.length; i++) {
                    locals.journeys[i].dep_date = moment(locals.journeys[i].dep_offset).format(datePattenr);
                    locals.journeys[i].dep_offset = moment(locals.journeys[i].dep_offset).format(timePattenr);
                    locals.journeys[i].arr_offset = moment(locals.journeys[i].arr_offset).format(timePattenr);
                    for (var j = 0; j < locals.journeys[i].segments.length; j++) {
                        locals.journeys[i].segments[j].dep_offset = moment(locals.journeys[i].segments[j].dep_offset).format(timePattenr);
                        locals.journeys[i].segments[j].arr_offset = moment(locals.journeys[i].segments[j].arr_offset).format(timePattenr);

                        if (locals.journeys[i].segments.length == 1) {
                            locals.changeDirect = 1;
                            locals.journeys[i].routType = 'direct';
                        } else if (locals.journeys[i].segments.length == 2) {
                            locals.change1 = 1;
                            locals.journeys[i].routType = '1 change';
                        } else {
                            locals.change2 = 1;
                            locals.journeys[i].routType = '2+ changes';
                        }

                    }
                    for (var k = 0; k < locals.journeys[i].fares.length; k++) {
                        locals.journeys[i].fares[k].price_in_cents = (locals.journeys[i].fares[k].price_in_cents / 100).toFixed(2);
                        locals.journeys[i].fares[k].price_in_rappen = (locals.journeys[i].fares[k].price_in_rappen / 100).toFixed(2);
                    }
                    for (var q = 0; q < locals.journeys[i].fares.length; q++) {
                        if (locals.journeys[i].fares[q].name.indexOf("Standard") != -1) {
                            locals.journeys[i].fares[q].cent1 = String(locals.journeys[i].fares[q].price_in_cents).split('.')[0];
                            locals.journeys[i].fares[q].cent2 = String(locals.journeys[i].fares[q].price_in_cents).split('.')[1];
                            if (locals.journeys[i].fares[q].comfort_class == 1) {
                                locals.journeys[i].class1 = locals.journeys[i].fares[q];
                            } else if (locals.journeys[i].fares[q].comfort_class == 2) {
                                locals.journeys[i].class2 = locals.journeys[i].fares[q];
                            }
                        }
                    }
                }

                var max = 0;
                for (var dr = 0; dr < locals.journeys.length; dr++) {
                    var duration = locals.journeys[dr].duration;
                    duration = duration.split(':');
                    console.log("DURATION : ", duration);
                    if( (Number(duration[0]) * 60 + Number(duration[1])) >  max){
                        max = Number(duration[0]) * 60;
                        max += Number(duration[1]);
                        locals.maxDuration = duration[0] + ":" + duration[1];
                    }
                }
                locals.destionations = {
                    arr_name: locals.journeys[0].arr_name,
                    dep_name: locals.journeys[0].dep_name,
                    dep_offset: locals.journeys[0].dep_offset,
                    arr_offset: locals.journeys[0].arr_offset,
                    dep_date: locals.journeys[0].dep_date
                };
                //price filter
                function filterPrice(price) {
                    var max = 0;
                    for (var pr = 0; pr < locals.journeys.length; pr++) {
                        if (locals.journeys[pr].class2.cent1 > max) {
                            max = locals.journeys[pr].class2.cent1;
                        }
                    }
                    locals.maxPrice = max;
                    var currentPrice = Math.round(max / 10 * locals.price);
                    console.log("prices", max, currentPrice);

                    var collectedPrice = [];
                    for (var w = 0; w < locals.journeys.length; w++) {
                        if (Number(locals.journeys[w].class2.cent1) <= currentPrice) {
                            collectedPrice.push(locals.journeys[w]);
                        }
                    }
                    locals.journeys = collectedPrice;
                }

                function durationFilter() {
                    var max = 0;
                    for (var dr = 0; dr < locals.journeys.length; dr++) {
                        var duration = locals.journeys[dr].duration;
                        duration = duration.split(':');
                        console.log("DURATION : ", duration);
                        if( (Number(duration[0]) * 60 + Number(duration[1])) >  max){
                            max = Number(duration[0]) * 60;
                            max += Number(duration[1]);
                        }
                    }

                    var currentDuration = Math.round(max / 10 * locals.duration);
                    var collectedDurations = [];
                    for (var dri = 0; dri < locals.journeys.length; dri++) {
                        var jDuration = 0;
                        var duration = locals.journeys[dri].duration;
                        duration = duration.split(':');
                        jDuration = Number(duration[0]) * 60;
                        jDuration += Number(duration[1]);
                        if (jDuration <= currentDuration) {
                            collectedDurations.push(locals.journeys[dri]);
                        }
                    }
                    locals.journeys = collectedDurations;
                }

                if (locals.price) {
                    filterPrice(locals.price);
                }
                if (locals.duration) {
                    durationFilter();
                }

                console.log(JSON.stringify(locals.journeys));
            }

            view.on('init', function (next) {
                next();
            });

            // Render the view
            view.render('results');
        } else {
            console.log("error", error);
            view.render('index');
        }


    });


};
