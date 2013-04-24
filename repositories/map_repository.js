var cradle = require('cradle');
var db_init = require('./db_init');
var util = require('util');

module.exports = (function() {
	var map = 'map';
	
	var writeResponse = function (callback, err, response) {
		if (err)
			callback(err, null);
		if (response)
			callback(null, response);
	};
	
	return {
		all: function(callback) {
			var db = db_init.connect(map);
			db.view('coords/all', function(err, response) {
				writeResponse(callback, err, response);
			});
		},
		add: function(coord, callback) {
			var db = db_init.connect(map);
			db.save(coord, function (err, response) {
				writeResponse(callback, err, response);
			});
		}
	};
})();