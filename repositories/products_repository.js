var cradle = require('cradle');
var db_init = require('./db_init');

module.exports = (function() {
	var products = 'products';
	
	return {
		all: function(callback) {
			var db = db_init.connect(products);
			db.view('products/all', function(err, response) {
				if (err) {
					callback(err, null);
				}
				
				if (response) {
					callback(null, response);
				}
			});
		},
		save: function(product, callback) {			
			var db = db_init.connect(products);
			db.save(product, function(err, response) {
				if (err)
					callback(err, null);
				if (response)
					callback(null, response);
			});
		},
		remove: function() {
			
		}
	};
})();