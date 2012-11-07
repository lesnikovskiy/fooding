var cradle = require('cradle');
var db_init = require('./db_init');
var _ = require('underscore');
var util = require('util');

module.exports = (function() {
	var accounts = 'accounts';

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
			if (!email) {
				sendResponse(callback, {
					error: 'email is required',
					reason: 'email parameter hasn\'t been provided'
				}, null);
			}

			var db = db_init.connect(accounts);
			db.view('getAccount/byEmail/?key=' + encodeURIComponent(email), function(err, res) {
				sendResponse(callback, err, res);
			});
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
