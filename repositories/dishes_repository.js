var cradle = require('cradle');
var db_init = require('./db_init');
var _ = require('underscore');
var util = require('util');

module.exports = (function() {
	var dishes = "dishes";

	var sendResponse = function (callback, err, response) {
		if (err) {
			console.log('if (err)');
			console.log(util.inspect(err));
			callback(err, null);
		}
		
		if (response) {
			console.log('if (response)');
			console.log(util.inspect(response));
			callback(null, response);
		}
	};

	return {
		saveDish: function(dish, callback) {
			var db = db_init.connect(dishes);
			db.save(dish, function(err, response) {
				sendResponse(callback, err, response);
			});
		}
	};
})();