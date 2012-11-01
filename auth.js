var util = require('util');

module.exports = (function() {
	return {
		checkAuth: function(req, res, next) {
			if (!req.cookies 
				|| !req.cookies.foodingaccess 
				|| req.cookies.foodingaccess !== '1-b8767f0228e22a1d3fe10e12e6d3d656') {
				res.redirect('/login');
			} else {
				next();
			}
		},
		checkApiAuth: function(req, res, next) {
			if (!req.cookies 
				|| !req.cookies.foodingaccess 
				|| req.cookies.foodingaccess !== '1-b8767f0228e22a1d3fe10e12e6d3d656') {
				res.json({
					error: 'Unauthorized',
					reason: 'authorize to get access to api'
				})
			} else {
				next();
			}
		}
	};
})();