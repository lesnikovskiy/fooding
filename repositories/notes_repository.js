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
		add: function(note, callback) {
			var db = db_init.connect(notes);
			db.save(note, function (err, response) {
				writeResponse(callback, err, response);
			});
		},
		remove: function(note, callback) {
			var db = db_init.connect(notes);
			
			if (!note.id && !note.rev) {
				writeResponse(callback, {
					error: 'Unable to remove note',
					reason: '_rev and _id must be provided'
				}, null);
			}
			
			db.remove(note.id, note.rev, function(err, response) {
				writeResponse(callback, err, response);
			});
		}
	}
})();