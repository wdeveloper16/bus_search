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

Handlebars.registerHelper('attr', function (name, data) {
    if (typeof target === 'undefined') target = "";

    var result = ' ' + name + '="' + data + '" ';

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
    locals.maxPrice = 0;
    locals.maxDuration = '';
    locals.changeDirect = 0;
    locals.change1 = 0;
    locals.change2 = 0;
    locals.topArr = '';
    locals.topDep = '';
    locals.depStart = 1440;
    locals.depEnd = 0;
    locals.arrStart = 1440;
    locals.arrEnd = 0;
    //console.log(locals.price);
    var apiUrl = 'https://ticketsapi3:asesmoccal@crawler2api.com/searchSbb?';

    request(apiUrl + locals.url, function (error, response, body) {
        if (!error && JSON.parse(body).journeys) {
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
                    var depTime = parseInt(locals.journeys[i].dep_offset.split(":")[0]) * 60 + parseInt(locals.journeys[i].dep_offset.split(":")[1]);
                    if (depTime < locals.depStart) {
                        locals.depStart = depTime;
                    }
                    if (depTime > locals.depEnd) {
                        locals.depEnd = depTime;
                    }
                    var arrTime = parseInt(locals.journeys[i].arr_offset.split(":")[0]) * 60 + parseInt(locals.journeys[i].arr_offset.split(":")[1]);
                    if (arrTime > locals.arrEnd) {
                        locals.arrEnd = arrTime;
                    }
                    if (arrTime < locals.arrStart) {
                        locals.arrStart = arrTime;
                    }
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
                        if (locals.journeys[i].fares[k].price_in_cents != "n/a") {
                            locals.journeys[i].fares[k].price_in_cents = (locals.journeys[i].fares[k].price_in_cents / 100).toFixed(2);
                            locals.journeys[i].fares[k].price_in_rappen = (locals.journeys[i].fares[k].price_in_rappen / 100).toFixed(2);
                        } else {
                            locals.journeys[i].fares[k].price_in_cents = 0;
                            locals.journeys[i].fares[k].price_in_rappen = 0;
                        }
                    }
                    for (var q = 0; q < locals.journeys[i].fares.length; q++) {
                        if (locals.journeys[i].fares[q].name.indexOf("Standard") != -1) {
                            if (locals.journeys[i].fares[q].price_in_cents != 0) {
                                locals.journeys[i].fares[q].cent1 = String(locals.journeys[i].fares[q].price_in_cents).split('.')[0];
                                locals.journeys[i].fares[q].cent2 = String(locals.journeys[i].fares[q].price_in_cents).split('.')[1];
                            } else {
                                locals.journeys[i].fares[q].cent1 = 'n/a';
                                locals.journeys[i].fares[q].cent2 = '';
                            }
                            if (locals.journeys[i].fares[q].comfort_class == 1) {
                                locals.journeys[i].class1 = locals.journeys[i].fares[q];
                            } else if (locals.journeys[i].fares[q].comfort_class == 2) {
                                locals.journeys[i].class2 = locals.journeys[i].fares[q];
                            }
                        }else{
                            locals.journeys[i].class2 = {
                                cent1: "n/a",
                                cent2: "",
                                comfort_class: 1,
                                name: "Standard-Ticket 1 Klasse",
                                price_in_cents: "n/a",
                                price_in_rappen: "n/a"
                            };
                            locals.journeys[i].class1 = {
                                cent1: "n/a",
                                cent2: "",
                                comfort_class: 2,
                                name: "Standard-Ticket 2 Klasse",
                                price_in_cents: "n/a",
                                price_in_rappen: "n/a"
                            };
                        }
                    }
                    var max = 0;
                    for (var pr = 0; pr < locals.journeys.length; pr++) {
                        if (typeof locals.journeys[pr].class2 != 'undefined' && locals.journeys[pr].class2.cent1 > max) {
                            max = locals.journeys[pr].class2.cent1;
                        }
                    }
                    locals.maxPrice = max;
                }
                var max = 0;
                for (var dr = 0; dr < locals.journeys.length; dr++) {
                    var duration = locals.journeys[dr].duration;
                    duration = duration.split(':');
                    //console.log("DURATION : ", duration);
                    if ((Number(duration[0]) * 60 + Number(duration[1])) > max) {
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
                locals.baseData = JSON.stringify(locals.journeys);
            }
            view.on('init', function (next) {
                next();
            });
            // Render the view
            view.render('results');
        } else {
            view.render('results');
        }
    });
};