var cradle = require('cradle');
var db_init = require('./db_init');
var util = require('util');

module.exports = (function() {
	var products = 'products';

	var sendResponse = function (callback, err, response) {
		if (err) {
			callback(err, null);
		} 

		if (response) {
			callback(null, response);
		}
	};

	return {
		all: function(callback) {
			var db = db_init.connect(products);
			db.view('products/all', function(err, response) {
				sendResponse(callback, err, response);
			});
		},
		get: function(id, callback) {
			var db = db_init.connect(products);
			if (!id) {
				sendResponse(callback, {error: 'cannot fetch product', reason: '_id is not provided'}, null);
			}

			db.get(id, function(err, response) {
				sendResponse(callback, err, response);
			});
		},
		save: function(product, callback) {	
			var db = db_init.connect(products);			
			db.save(product, function(err, response) {		
				sendResponse(callback, err, response);
			});
		},
		update: function(product, callback) {
			if (!product.id) {
				sendResponse(callback, {
					error: 'Unable to update product',
					reason: '_id must be provided'
				}, null);
			}
			var db = db_init.connect(products);
			db.save(product.id, product, function(err, res) {
				sendResponse(callback, err, res);
			});
		},
		remove: function(product, callback) {
			var db = db_init.connect(products);
			if (!product.id && !product.rev) {
				sendResponse(callback, {
					error: 'Unable to remove product',
					reason: '_rev and _id must be provided'
				}, null);
			}

			db.remove(product.id, product.rev, function(err, response) {
				sendResponse(callback, err, response);
			});
		},
		findByName: function(key, callback) {
			var key = decodeURIComponent(key);
			var db = db_init.connect(products);
			db.view('findProduct/byName', {startkey: key, endkey: key + '\u9999'}, function(err, response) {
				sendResponse(callback, err, response);
			});
		}
	};
})();