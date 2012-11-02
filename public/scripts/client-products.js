var utils = (function() {
	_.mixin({
		encode: function(string) {
			return encodeURIComponent(string);
		}
	});

	return {
		serialize: function(jsObject) {
			var items = [];
			
			_.each(jsObject, function(val, key) {
				if (_.isFunction(val)) {
					items.push(key + '=' + _(val()).encode());
				} else if (_.isDate(val)) {
				    items.push(key + '=' + _(val.toUTCString()).encode());
				} else {
					items.push(key + '=' + _(val).encode());
				}
			});
			
			return items.join('&');
		}
	};
})();

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
	removeProduct: function(product) {
		var p = product;
		
		$.ajax({		
			type: 'POST',
			url: p.removeUrl,
			data: utils.serialize(_.pick(p, 'id', 'rev')),
			success: function(response) {
				if (response) {
					if (_.has(response, 'error'))
						console.log('error');
					if (_.has(response, 'response')) {
						if (response.response.ok)
							productViewModel.products.remove(p);
					}
				}
			}
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
	},
	submitUpdate: function(product) {
		var p = product;	
		$.ajax({
			type: 'POST',
			url: p.updateUrl,
			data: utils.serialize(_.pick(p, 'id', 'rev', 'name', 'price')),
			success: function(response) {
				if (response) {	
					if (_.has(response, 'response')) {
						console.log(response.response.ok);
						if (response.response.rev)
							p.rev(response.response.rev);
					}

					if (_.has(response, 'error'))
						console.log('error');
				}
			},
			complete: function() {
				p.itemView(true);
				p.editView(false);
				p.controls(true);
			}
		});
	
		return false;
	}
};

$(document).ready(function() {
	ko.applyBindings(productViewModel);

	$.validator.addMethod('price', function(value) {
		return /^\d*\.?\d{0,2}$/gi.test(value);
	});

	$('#add-product-form').validate({
		submitHandler: function(form) {
			$(form).ajaxSubmit({
				type: 'POST',
				url: '/api/products/add',
				success: function(response) {
					if (_.has(response, 'error')) {
						if (response.error.error) {
							console.log('Error: ' + response.error.error)
						}
						
						if (response.error.reason) {
							console.log('Reason: ' + response.error.reason);
						}
					}
					
					if (_.has(response, 'response')) {
						productViewModel.products.push(
							new Product(response.response.id, response.response.rev, $('#name').val(), $('#price').val())
						);
					}

					$('#modal-dialog').fadeOut();
				}
			});
		},
		rules: {
			name: 'required',
			price: {
				required: true,
				price: true
			}
		},
		messages: {
			name: 'Product name is required',
			price: 'Price is required in correct format e.g. 12.55'
		}
	});

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
/*
	$('#add-product-form').submit(function() {	
		$.ajax({
			type: $(this).attr('method'),
			url: $(this).attr('action'),
			data: $(this).serialize(),
			success: function(response) {
				if (_.has(response, 'error')) {
					if (response.error.error) {
						console.log('Error: ' + response.error.error)
					}
					
					if (response.error.reason) {
						console.log('Reason: ' + response.error.reason);
					}
				}
				
				if (_.has(response, 'response')) {
					productViewModel.products.push(
						new Product(response.response.id, response.response.rev, $('#name').val(), $('#price').val())
					);
				}
			},
			complete: function() {
				$('#name').val('');
				$('#price').val('');
				
				$('#modal-dialog').fadeOut();
			}
		});

		return false;
	});
*/
});
