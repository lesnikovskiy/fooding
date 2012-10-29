function Product(id, rev, name, price) {
	this.id = ko.observable(id);
	this.rev = ko.observable(rev);
	this.name = ko.observable(name);
	this.price = ko.observable(price);
	this.getProductUrl = ko.computed(function() {
		return '/api/products/get/' + this.id();
	}, this);
	this.getRemoveUrl = ko.computed(function() {
		return '/api/products/remove';
	}, this);
}

var productViewModel = {
	products: ko.observableArray()
};

$(document).ready(function() {
	ko.applyBindings(productViewModel);

	$.ajax({
		type: 'GET',
		cache: false,
		url: '/api/products/list/',
		success: function(response) {
			$.each(response, function() {
				productViewModel.products.push(
					new Product(this.value.id, this.value.rev, this.value.name, this.value.price)
				);
			});
		}
	});

	$('#create-product').click(function() {
		$('#modal-dialog').center().fadeIn();
	});

	$('#cancel-add').click(function() {
		$('#modal-dialog').fadeOut();

		return false;
	}); 

	$('#add-product-form').submit(function() {
		$.ajax({
			type: $(this).attr('method'),
			url: $(this).attr('action'),
			data: $(this).serialize(),
			success: function(response) {
				productViewModel.products.push(
					new Product(response.response.id, response.response.rev, $('#name').val(), $('#price').val())
				);
			},
			complete: function() {
				$('#name').val('');
				$('#price').val('');
				$('#modal-dialog').fadeOut();

			}
		});

		return false;
	});

	$('.delete-form').live('submit', function() {
		var self = $(this);
		$.ajax({
			type: self.attr('method'),
			url: self.attr('action'),
			data: self.serialize(),
			success: function(response) {
				productViewModel.products.remove(function() {
					return products.id == response.response.id;
				});
			}
		});

		return false;
	});
});
