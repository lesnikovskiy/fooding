$(document).ready(function() {
	$('#product').autocomplete('/api/products/find', {
		remoteDataType: 'json',
		minChars: 1,
		processData: function (data) {
			var processed = [];
			for (var i = 0; i < data.length; i++) {
				processed.push([data[i].value.name]);
			}

			return processed;
		}
	});
});