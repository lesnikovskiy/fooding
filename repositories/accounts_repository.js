var cradle = require('cradle');
var db_init = require('./db_init');
var util = require('util');

module.exports = (function() {
	var accounts = 'accounts';

	var sendResponse = function (callback, err, response) {
		if (err)
			callback(err, null);
		if (response)
			callback(null, response);
		else
			callback({error: 'error occurred', reason: 'unkown'}, null);
	};

	return {
		all: function(callback) {
			var db = db_init.connect(accounts);
			db.view('accounts/all', function(err, response) {
				sendResponse(callback, err, response);
			});
		},
		saveAccount: function(account, callback) {
			var db = db_init.connect(accounts);
			db.save(account, function(err, response) {
				sendResponse(callback, err, response);
			});
		},
		getAccountByEmail: function(email, callback) {
			
		}
	};
})();

/* //accounts model
{
	"_id":"39c943a61fdb8bad209396e363000d6a",
	"_rev":"1-27c23990243bf8987d23158cf3876945",
	"firstName":"Ruslan",
	"lastName":"Lesnikovskiy",
	"nick":"ruscodeveloper",
	"email":"lesnikovski@gmail.com",
	"password":null,
	"pass":"Coffee!12",
	"bio":"I am developer of this system. Hopefully, it will be really useful.",
	"roles":"['admin','user']",
	"location":"Kiev, Ukraine"
}
*/
