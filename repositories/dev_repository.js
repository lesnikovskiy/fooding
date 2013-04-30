var cradle = require('cradle');
var db_init = require('./db_init');

module.exports = (function () {
	var products = 'products';
	var accounts = 'accounts';
	var notes = 'notes';
	var map = 'map';

	return {
		createProductsDb: function(callback) {
			var db = db_init.connect(products);
			db.exists(function(err, exists) {
				if (err) {
					callback(err, null);
				} 

				if (exists) {
					callback({
						error: 'cannot create database', 
						reason: 'database already exists'
					}, null);
				}

				if(!exists) {
					db.create();
				}
			});
		},
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
		// this will search account by email passed via ?key= parameter
		// findProduct/byName/?key='%mi%'
		createFindProductByNameView: function(callback) {
			var db = db_init.connect(products);
			db.save('_design/findProduct', {
				byName: {
					map: function(doc) {
						emit(doc.name, {
							id: doc._id,
							name: doc.name,
							price: doc.price
						});
					}
				}
			}, function(err, response) {
				if (err)
					callback(err, null);
				if (response)
					callback(null, response);
			});
		},
		createAccountsDb: function(callback) {
			var db = db_init.connect(accounts);
			db.exists(function(err, exists) {
				if (err) {
					callback(err, null);
				} 

				if (exists) {
					callback({
						error: 'cannot create database', 
						reason: 'database already exists'
					}, null);
				}

				if(!exists) {
					db.create();
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
			});
		},		
		createGetAccByEmail: function(callback) {
			var db = db_init.connect(accounts);
			// this will search account by email passed via ?key= parameter
			// getAccount/byEmail/?key=lesnikovski%40gmail.com
			db.save('_design/getAccount', {
				byEmail: {
					map: function(doc) {
						emit(doc.email, {
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
			}, function(err, res) {
				if (err) {
					callback(err, null);
				} 

				if (res) {
					callback(null, res);
				}
			});
		},
		createNotesView: function(callback) {
			var db = db_init.connect(notes);
			db.save('_design/notes', {
				all: {
					map: function(doc) {
						if (doc.title && doc.body) {
							emit(doc._id, {id: doc._id, rev: doc._rev, title: doc.title, body: doc.body});
						}
					}
				}
			}, function(err, response) {
				if (err)
					callback(err, null);
				if (response)
					callback(null, response);
			});
		},
		createMapView: function(callback) {
			var db = db_init.connect(map);
			db.save('_design/coords', {
				all: {
					map: function(doc) {
						if (doc.lat && doc.lng && doc.title) 
							emit(doc._id, {id: doc._id, rev: doc._rev, title: doc.title, desc: doc.desc, lat: doc.lat, lng: doc.lng});
					}
				}
			}, function (err, response) {
				if (err)
					callback(err, null);
				if (response)
					callback(null, response);
			});
		}
	};	
})();