/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function(req, res, next) {
    res.notfound();
});


// Import Route Controllers
var routes = {
	api: importRoutes('./api'),
	views: importRoutes('./views'),
	tests: importRoutes('./tests'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', middleware.requireUser, routes.views.index);
	app.get('/land/', function(req,res){res.redirect('/')});
	app.get('/bundesland/', function(req,res){res.redirect('/')});
	app.get('/stadt/', function(req,res){res.redirect('/')});
	app.get('/mapTown/', function(req,res){res.redirect('/')});
	app.get('/mapStop/', function(req,res){res.redirect('/')});
	app.get('/land/:name', middleware.requireUser, routes.views.country);
	app.get('/bundesland/:name', middleware.requireUser, routes.views.state);
	app.get('/stadt/:name', middleware.requireUser, routes.views.town);
	app.get('/mapTown/:name', middleware.requireUser, routes.views.mapTown);
	app.get('/mapStop/:name', middleware.requireUser, routes.views.mapStop);
	app.get('/impressum', middleware.requireUser, routes.views.impressum);
	app.get('/bildernachweis', middleware.requireUser, routes.views.bildernachweis);
	app.post('/fahrplan', middleware.requireUser, routes.api.plan);
	app.get('/acStops', middleware.requireUser, routes.api.acStops);
	app.get('/ksebmojysr/test1', middleware.requireUser, routes.tests.test1);
	app.get('/ksebmojysr/index', middleware.requireUser, routes.tests.indexmd);
	app.get('/ksebmojysr/stadt/:name', middleware.requireUser, routes.tests.townmd);
	app.get('/ksebmojysr/:name', middleware.requireUser, routes.tests.stopmd);
	app.get('/:name', middleware.requireUser, routes.views.stop);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
