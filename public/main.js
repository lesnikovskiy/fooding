$(document).ready(function() {
	$('#new-product-form').submit(function() {
		$.ajax({
			type: 'POST',
			data: $(this).serialize(),
			url: $(this).attr('action'),
			success: function(res) {
				if (res.ok) {
					alert('saved');
				}
				
				if (res.error) {
					alert('error occurred');
				}
			}
		});
	
		return false;
	});
});