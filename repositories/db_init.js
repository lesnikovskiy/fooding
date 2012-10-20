var cradle = require('cradle');
var config = require('./db_config');

module.exports = (function() {
	return {
		connect: function(dbname) {
			return new(cradle.Connection)(config.host, config.port, {
				auth: {
					username: config.login,
					password: config.password
				}
			}).database(dbname);
		}
	}
})();