var cradle = require('cradle');
var db_init = require('./db_init');

module.exports = (function () {
	var products = 'products';
	var accounts = 'accounts';

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
		},
		createAccountsAllView: function(callback) {
			var db = db_init.connect(accounts);
			db.save('_design/accounts', {
				all: {
					map: function(doc) {
						if (doc.firstName && doc.lastName && doc.email && doc.nick && doc.pass) {
							emit(doc._id, {
								id: doc._id,
								rev: doc._rev,
								firstName: doc.firstName,
								lastName: doc.lastName,
								nick: doc.nick,
								email: doc.email,
								pass: doc.pass,
								bio: doc.bio ? doc.bio : '',
								roles: doc.roles,
								location: doc['location'] ? doc['location'] : ''
							});
						}
					}
				}
			}, function(err, response) {
				if (err)
					callback(err, null);
				if (response)
					callback(null, response);
				else
					callback({
						error: 'unknown',
						reason: 'unknown'
					}, null);
			});
		}
	};	
})();