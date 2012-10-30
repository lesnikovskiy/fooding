function Product(id, rev, name, price) {
	this.id = ko.observable(id);
	this.rev = ko.observable(rev);
	this.name = ko.observable(name);
	this.price = ko.observable(price);
	
	this.getUrl = ko.computed(function() {
		return '/api/products/get/' + this.id();
	}, this);
	this.removeUrl = '/api/products/remove';
	this.updateUrl = '/api/products/update';

	this.itemView = ko.observable(true);
	this.editView = ko.observable(false);
	this.controls = ko.observable(true);
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
	},
	updateProduct: function(product) {
		product.itemView(false);
		product.editView(true);
		product.controls(false);
	},
	cancelUpdate: function(product) {
		product.itemView(true);
		product.editView(false);
		product.controls(true);
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
			data: $(this).serialize(),
			success: function(response) {
				if (response) {	
					if (response.response) {
						alert(response.response.ok);

						$parent.cancelUpdate();
					}

					if (response.error)
						alert('error');
					// todo update the observable array
				}
			}
		});
	
		return false;
	});
});
