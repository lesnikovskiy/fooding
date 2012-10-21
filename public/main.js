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
	
});