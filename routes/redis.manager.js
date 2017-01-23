var redisPool = require('redis-connection-pool');
/*
var timeDb = redisPool('myRedisPool', {
  database: 0,
  port: 6380,
  options: {
    auth_pass: 'sCAC4gU2zEgv78UKUDqwSyyp'
  }
});
*/
var config = {
  database: 0,
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379
}
if (process.env.REDIS_PASS) {
  config.options = {auth_pass: process.env.REDIS_PASS};
}
var timeDb = redisPool('myRedisPool', config);

exports.setTimetable = function(stopID, dir, dtStr, tmStr, value, callback) {
  if (!timeDb) {
  	console.log("No Redis Database");
  	return;
  }
  var id = stopID+"_"+dir+"_"+dtStr+"_"+tmStr;
  timeDb.set(id, value, function(err) {
  	if (err) {
  		callback(err);
  		return;
  	}
  	timeDb.expire(id, 604800, function(err) {
  		callback(err);
  	});
  });
}

exports.getTimetable = function(stopID, dir, dtStr, tmStr, callback) {
  if (!timeDb) {
  	console.log("No Redis Database");
  	return;
  }
  var id = stopID+"_"+dir+"_"+dtStr+"_"+tmStr;
  timeDb.get(id, function(err, reply) {
  	if (err) {
  		callback(err, null);
  		return;
  	}
  	callback(null, reply);
  });
}