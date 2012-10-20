var cradle = require('cradle');
var db_init = require('./db_init');

module.exports = (function () {
	var products = 'products';

	return {
		createProductsAllView: function(callback) {
			var db = db_init.connect(products);
			db.save('_design/products', {
				all: {
					map: function(doc) {
						if (doc.name && doc.price) {
							emit(doc._id, {id: doc._id, rev: doc._rev, name: doc.name, price: doc.price});
						}
					}
				}
			}, function(err, response) {
				if (err) {
					callback(err, null);
				}
					
				if (response) {
					callback(null, response);
				}
			});
		}
	};	
})();