module.exports = (function() {
	return {
		validate: function(obj, required) {			
			if (required.length === 0) {
				return {
					isValid: true
				}
			}
			
			var reason = '';
			var isValid = true;
			
			for (var i = 0; i < required.length; i++) {
				var prop = required[i];
			
				if (!obj.hasOwnProperty(prop)) {
					isValid = false;
					reason += prop + ' is required.\n';
				} else if (!obj[prop]) {
					isValid = false;
					reason += prop + ' value cannot be empty.\n';
				}
			}
			
			if (!isValid) {
				return {
					error: 'validation failed',
					reason: reason,
					isValid: isValid
				}
			} else {
				return {
					isValid: true
				}
			}
		}
	};
})();