$(document).ready(function() {
	$('#product').autocomplete('/api/products/find', {
		highlight: false,
		scroll: true,
		scrollHeight: 300,
		selectFirst:false,
		minChars: 1,
		parse: function(data) {			
			var names = [];
			_.map(data, function(val) {
				names.push({name: val.value.name});
			});

			return names;
		}
	});
});