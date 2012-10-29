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
	products: ko.observableArray(),
	addProduct: function(product) {
		this.products.push(product);
	},
	removeProduct: function(id) {
		this.products.remove(function(product) {
			return product.id() === id;
		});
	}
};

$(document).ready(function() {
	ko.applyBindings(productViewModel);

	$.ajax({
		type: 'GET',
		cache: false,
		url: '/api/products/list/',
		success: function(response) {
			$.each(response, function() {
				productViewModel.addProduct(new Product(this.value.id, this.value.rev, this.value.name, this.value.price));
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
		var isUpdate = $(this).attr('action') === '/api/products/update' ? true : false; 
	
		$.ajax({
			type: $(this).attr('method'),
			url: $(this).attr('action'),
			data: $(this).serialize(),
			success: function(response) {
				if (!isUpdate) {
					productViewModel.products.push(
						new Product(response.response.id, response.response.rev, $('#name').val(), $('#price').val())
					);
				} else {				
					// todo: decide what to to with updates
				}
			},
			complete: function() {
				$('#name').val('');
				$('#price').val('');
				$('#add-product-form').attr('action', '/api/products/add');
				$('#_id, #_rev').remove();
				
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
				if (response.error)
					alert('error');
				if (response.response) {
					var id = response.response.id;	
					productViewModel.removeProduct(id);
				}
			}
		});

		return false;
	});
	
	$('.edit-form').live('submit', function() {
		$.ajax({
			type: $(this).attr('method'),
			url: $(this).attr('action'),
			data: {},
			success: function(response) {
				if (response) {		
					$('#name').val(response.name);
					$('#price').val(response.price);
					
					$('<input />', {type: 'hidden', name: 'id', id: "_id", value: response._id}).appendTo('#add-product-form');
					$('<input />', {type: 'hidden', name: 'rev', id: "_rev", value: response._rev}).appendTo('#add-product-form');
					
					$('#add-product-form').attr('action', '/api/products/update');
				
					$('#modal-dialog').center().fadeIn();
				}
			}
		});
	
		return false;
	});
});
