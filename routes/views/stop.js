var keystone = require('keystone');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var middleware = require('../middleware');
var redisManager = require('../redis.manager.js');

var useragents = require('../useragents.json');
var proxyList = require('../proxies.json');

var uagents = _.sampleSize(useragents, useragents.length);
var proxies = _.sampleSize(proxyList.proxies, proxyList.proxies.length);
proxies = _.map(proxies, function (val) {
    if (!val)
        return val;
    return "http://" + proxyList.username + ":" + proxyList.password + "@" + val;
});
var cnt = 0;


exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.name = req.params.name;
    locals.section = 'stop';

    locals.data = {
        title: "",
        transports: [],
        prevUrl: "",
        nextUrl: "",
        searchDate: "",
        searchTime: "",
        searchDir: "",
        searchName: ""

    };

    function isNumeric(str) {
        return str.length === 0 || str.replace(/\s/g, "").length === 0 ? false : !isNaN(str)
    };

    function parseBody(body, stop, next) {
        try {
            var $ = cheerio.load(body);
            if ($(".error h2").text() == "Hinweis") {
                console.log("Hinweis for " + stop.location.name);
                locals.error = {
                    title: "Hinweis",
                    text: "Leider ist unser System gerade besetzt. Bitte versuchen Sie es später noch einmal."
                };
                next("Hinweis");
                return;
            };
            var means = {};
            means[stop.stopID] = [];
            locals.data.title = $("#sqResult h2").children().last().text()
                .replace('Aktueller','')
                .replace('Abfahrtsplan','')
                .replace('Ankunftsplan','');
            var stopids = [stop.stopID];
            $("tr[id^=journeyRow]").each(function () {
                var green = false;
                var red = false;
                var ris = $(this).children(".ris").last().text();
                if (isNumeric(ris)) {
                    if (ris < 0)
                        red = true;
                    else
                        green = true;
                }
                var stopHref = $(this).children(".route").children().first().find("a").attr('href');
                var match = stopHref.match(/.*%23(\d+).*/);
                stopid = (match && match.length > 1) ? match[1] : "";
                stopids.push(stopid);
                if (!means.stopid)
                    means[stopid] = [];
                var img = $(this).children(".train").first().children().first().html();
                var matchI = img.match(/src="(.*\/)(.*)_24x24.gif/);
                if (matchI && matchI.length == 3) {
                    means[stopid] = _.union([matchI[2]], means[stopid]);
                    means[stop.stopID] = _.union([matchI[2]], means[stop.stopID])
                    img = img.replace(matchI[1], "/images/reise/");
                }

                locals.data.transports.push({
                    time: $(this).children(".time").last().text(),
                    img: img,
                    train: $(this).children(".train").last().text(),
                    title: $(this).children(".route").children().first().text(),
                    route: $(this).children(".route").clone().children().remove().end().html(),
                    platform: $(this).children(".platform").last().text(),
                    stopid: stopid,
                    ris: ris,
                    green: green,
                    red: red
                });
            });
            var uniqueids = _.uniq(stopids);
            var rels = {};
            var q = keystone.list('Stop').model.find({'stopID': {$in: uniqueids}});
            q.exec(function (err, results) {
                if (err || !results) {
                  next(err);
                  return;
                }

                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var sid = result.stopID;
                    var url = result.url.name;
                    rels[sid] = url;
                    var diff = _.difference(means[result.stopID], result.transportation);
                    if (diff.length) {
                        var union = _.union(means[result.stopID], result.transportation);
                        result.transportation = _.sortBy(union);
                        result.save();
                    }
                }
                for (var i = 0; i < locals.data.transports.length; i++) {
                    var sid = locals.data.transports[i].stopid;
                    locals.data.transports[i].url = rels[sid];
                }
                if (locals.data.transports) {
              			var halflen = Math.floor(locals.data.transports.length/2);
              			if (halflen < 10)
              			  halflen = 10;
              			locals.data.transportsright = locals.data.transports.slice(0);
              			locals.data.transportsleft = locals.data.transportsright.splice(0,halflen);
            		}
                

                var q2 = keystone.list('Station').model.findOne({'stopid': stop.stopID});
                q2.exec(function (err, station) {
                    if (station) {
                        locals.data.details = {
                            dbinformation: {exists: false, name: "DB-Information",icon: "fa-info"},
                            mobilerservice: {exists: false, name: "Mobiler Service", icon: "fa-life-ring"},
                            reisezentrum: {exists: false, name: "Reisezentrum", icon: "fa-ticket"},
                            dblounge: {exists: false, name: "DB Lounge", icon: "fa-coffee"},
                            sfach: {exists: false, name: "Schließfächer", icon: "fa-inbox"},
                            mobse: {exists: false, name: "Mobilitätsservice", icon: "fa-wheelchair-alt"},
                            stufr: {exists: false, name: "Stufenfreier Zugang", icon: "fa-wheelchair"},
                            funds: {exists: false, name: "Fundservice", icon: "fa-briefcase"},
                            // nam3s: {exists: false, name: "3-S-Zentrale"},
                            toile: {exists: false, name: "WC", icon: "fa-venus-mars"},
                            parkpl: {exists: false, name: "Parkplätze", icon: "fa-automobile"},
                            fahrsp: {exists: false, name: "Fahrrad-Stellplätze", icon: "fa-briefcase"},
                            oepnv: {exists: false, name: "ÖPNV-Anbindung",icon: "fa-bus"},
                            taxi: {exists: false, name: "Taxi", icon: "fa-taxi"},
                            mietwagen: {exists: false, name: "Mietwagen", icon: "fa-road"},
                            rbed: {exists: false, name: "Reisebedarf", icon: "fa-newspaper-o"},
                            wlan: {exists: false, name: "WLAN im Bahnhof",icon: "fa-wifi"},
                            bmission: {exists: false, name: "Bahnhofsmission", icon: "fa-umbrella"}
                        };
                        for (var key in locals.data.details) {
                            if (station[key]) {
                                locals.data.details[key].exists = true;
                                // locals.data.details[key].name = station[key];
                            }
                        }
                    }
                    locals.data.center = stop.location.geo;
                    locals.data.stop_img = stop.img;
                    next(err);
                });
            })
        } catch(ex) {
            next(ex);
        }
    }

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
            var name = stop.location.name;
            locals.title = stop.location.suburb + ", " + name + ": Abfahrt und Ankunft";
            locals.heading = "Fahrplan für " + name;
            var regex = new RegExp(", " + stop.location.suburb + "$");
            if (!regex.test(name))
                locals.heading += " in " + stop.location.suburb;
            var stopid = stop.stopID;
            var suburb = stop.location.suburb;
            var state = stop.location.country;
            if (state == "Deutschland")
                state = stop.location.state;
            if (stop.img)
                locals.style = "body {background-image:url('/images/stops/" + stop.img + "'); background-repeat:no-repeat;background-position:center top;background-size:100%}";
            locals.keywords = name + ", " + suburb + ", " + state + ", Nahverkehr, Bahnhof, Netzplan, U-Bahn, S-Bahn, Straßenbahn, Bus, Abfahrt, Ankunft";
            locals.description = "Fahrplanauskunft der Haltestelle bzw. Bahnhof " + name + " in " + suburb;
            locals.breadcrumbs = [{url: "/stadt/" + stop.url.suburb, name: suburb}, {
                url: "/" + locals.name,
                name: name
            }];
            var dates = middleware.validDate(req.query.date, req.query.time);
            var dir = middleware.validDir(req.query.dir);
            locals.data.searchDate = dates.date;
            locals.data.searchTime = dates.nowTm;
            var reverseDir = "arr";
            if (dir == "arr") {
                reverseDir = "dep";
                locals.data.searchDir = dir;
            }
            locals.data.searchName = name;
            locals.data.reverseUrl = '/' + locals.name + '?date=' + dates.nowDt + '&time=' + dates.nowTm + '&dir=' + reverseDir;
            locals.data.prevUrl = '/' + locals.name + '?date=' + dates.prevDt + '&time=' + dates.prevTm + '&dir=' + dir;
            var nowUrl = 'http://reiseauskunft.bahn.de/bin/bhftafel.exe/dn?rt=1&input=' + stopid + '&boardType=' + dir + '&time=' + dates.nowTm + '&dateBegin=' + dates.bahnDt + '&start=yes&maxJourneys=20';
            locals.data.nextUrl = '/' + locals.name + '?date=' + dates.nextDt + '&time=' + dates.nextTm + '&dir=' + dir;
            redisManager.getTimetable(stopid, dir, dates.bahnDt, dates.nowTm, function (err, body) {
                if (err) {
                    console.log("Error getting timetable from redis");
                }
                if (!body) {
                    var options = {
                        url: nowUrl,
                        headers: {'User-Agent': uagents[cnt%uagents.length]},
                        timeout: 15000
                    };
                    if (proxies.length) {
                        options.proxy = proxies[cnt%proxies.length];
                    }
                    cnt++;
                    request(options, function (error, response, body) {
                        if (error || response.statusCode == 403) {
                            locals.error = {
                                title: "Hinweis",
                                text: "Leider ist unser System gerade besetzt. Bitte versuchen Sie es später noch einmal."
                            };
                            next(error);
                            return;
                        }
                        redisManager.setTimetable(stopid, dir, dates.bahnDt, dates.nowTm, body, function (err) {
                            if (err) console.log("Error setting timetable to redis");
                            parseBody(body, stop, next);
                        });
                    });
                } else {
                    parseBody(body, stop, next);
                }
            });
        });
    });

    // Render the view
    view.render('stop');
};
