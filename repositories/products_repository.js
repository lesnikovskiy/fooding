var cradle = require('cradle');
var db_init = require('./db_init');
var util = require('util');

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
		get: function(id, callback) {
			var db = db_init.connect(products);
			if (!id) {
				callback({error: 'cannot fetch product', reason: '_id is not provided'}, null);
			}

			db.get(id, function(err, response) {
				if (err)
					callback(err, null);
				if (response)
					callback(null, response);
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
		update: function(product, callback) {
			if (!product.id) {
				callback({
					error: 'Unable to update product',
					reason: '_id must be provided'
				}, null);
			}
			var db = db_init.connect(products);
			db.save(product.id, product, function(err, res) {
				console.log()
				if (err)
					callback(err, null);
				if (res)
					callback(null, res);
			});
		},
		remove: function(product, callback) {
			var db = db_init.connect(products);
			if (!product.id && !product.rev) {
				callback({
					error: 'Unable to remove product',
					reason: '_rev and _id must be provided'
				}, null);
			}

			db.remove(product.id, product.rev, function(err, response) {
				if (err)
					callback(err, null);
				if (response)
					callback(null, response);
			});
		}
	};
})();