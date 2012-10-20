(function($) {
	$.fn.extend({
		center: function() {
			return this.each(function() {
				var top = (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop() + 'px';
				var left = (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft() + 'px';
				$(this).css('position', 'absolute');
				$(this).css('top', top);
				$(this).css('left', left);

				return $(this);
			});
		}
	});
})(jQuery);

$(document).ready(function() {
	$('#add-product-menu').click(function() {
		// todo: show form

		return false;
	});

	$('#add-product-menu').submit(function() {
		$.ajax({
			beforeSend: function(xhr) {
				xhr.setRequestHeader('x-powered-with', 'XMLHttpRequest')
			},
			type: 'POST',
			data: $(this).serialize(),
			url: $(this).attr('action'),
			cache: false,
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