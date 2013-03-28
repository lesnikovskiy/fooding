var cradle = require('cradle');
var db_init = require('./db_init');
var util = require('util');

module.exports = (function() {
	var notes = 'notes';
	
	var writeResponse = function (callback, err, response) {
		if (err)
			callback(err, null);
		if (response)
			callback(null, response);
	};
	
	return {
		all: function(callback) {
			var db = db_init.connect(notes);
			db.view('notes/all', function(err, response) {
				writeResponse(callback, err, response);
			});
		},
		add: function(product, callback) {
			var db = db_init.connect(notes);
			db.save(product, function (err, response) {
				writeResponse(callback, err, response);
			});
		}
	}
})();