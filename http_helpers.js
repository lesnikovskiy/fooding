module.exports = (function() {
	return {
		isAjaxRequest: function(req) {
			return req.headers.hasOwnProperty('x-requested-with') && req.headers['x-requested-with'] === 'XMLHttpRequest'
				? true
				: false;
		}
	};
})();