/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var moment = require('moment');
var url = require('url');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
	];
	res.locals.user = req.user;
	if (process.env.NODE_ENV == "production" && process.env.GA_TID)
		res.locals.gatid = process.env.GA_TID;
	next();
};

/**
    Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {
    
    res.err = function(err, title, message) {
        res.status(500).render('errors/500');
    }
    
    res.notfound = function() {
        res.status(404).render('errors/404');
    }
    
    next();
    
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (process.env.NODE_ENV != "production" && !req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

exports.validDate = function(dt, tm) {
	var dates = {};

	var m = moment(dt, "DD.MM.YYYY", true);
	if (!m.isValid()) {
		m = moment(new Date());
	}
	dates.nowDt = m.format("DD.MM.YYYY");
	dates.bahnDt = m.format("DD.MM.YY");
	dates.date = m.toDate().getTime();

	m = moment(tm, "HH:mm", true);
	if (!m.isValid()) {
		m = moment(new Date());
	}
	dates.nowTm = m.format("HH:mm");
	
	m = moment(dates.nowDt+" "+dates.nowTm, "DD.MM.YYYY HH:mm", true);
	m.subtract(1,'h');
	dates.prevDt = m.format("DD.MM.YYYY");
	dates.prevTm = m.format("HH:mm");
	m.add(2,'h');
	dates.nextDt = m.format("DD.MM.YYYY");
	dates.nextTm = m.format("HH:mm");
	
	return (dates);
}

exports.validTime = function(tm) {
	if (m.isValid())
		return tm;
		
	m = moment(new Date());
	return (m.format("HH:mm"));
}

exports.validDir = function(dir) {
	if (dir != "arr" && dir != "dep")
		dir = "dep";
	return dir;
}

exports.calcDistance = function(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

exports.fullUrl = function(req) {
	var url_parts = url.parse(req.url);
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.baseUrl + url_parts.pathname
  });
}
