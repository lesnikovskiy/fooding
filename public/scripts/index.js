$(document).ready(function() {
	var Router = Backbone.Router.extend({
		routes: {
			'': 'home',
			'!/': 'home',
			'!/dishes': 'dishes',
			'!/products': 'products'
		},
		home: function() {
			$('#new-dish-panel').hide();
			$('#products').hide();
			$('#login-view').hide();
			
			$('#menu-blocks').show();
		},
		dishes: function() {
			$('#menu-blocks').hide();
			$('#products').hide();
			$('#login-view').hide();

			var dishModel = new Dish();
			var dishView = new DishView({model: dishModel}); 
		},
		products: function() {
			$('#menu-blocks').hide();
			$('#new-dish-panel').hide();
			$('#login-view').hide();

			var products = new Products();
			var productsView = new ProductsView({model: products});
		}
	});

	var router = new Router();
	Backbone.history.start();

	var Error = Backbone.Model.extend({
		defaults: {
			message: 'Error occurred'
		}
	});

	var ErrorMessage = Backbone.View.extend({
		el: $('#modal-dialog'),
		initialize: function() {
			this.render();		
		},
		render: function() {
			var template = _.template($('#error-template').html(), {});			
			this.$el.html(template).center().fadeIn();
			this.$el.find('.errormsg').html(this.model.get('message'));
		},
		events: {
			'click #closeButton': 'close'
		},
		close: function() {
			this.$el.fadeOut();
		}
	});		

	var Product = Backbone.Model.extend({
		url: '/api/product/',
		defaults: {
			id: '',
			rev: '',
			name: '',
			price: ''
		}
	});

	var Products = Backbone.Model.extend({
		url: '/api/products/list/',
		model: Product
	});

	var ProductsView = Backbone.View.extend({
		el: $('#products'),
		url: '/api/product/list/',
		initialize: function() {
			this.render();
		},
		render: function() {
			var context = this;
		
			var template = _.template($('#products-template').html(), {});
			context.$el.html(template).show();

			this.model.fetch({
				error: function(model, response) {
					console.log(response);
				},
				success: function(model, response) {
					//debugger;
					var products = model.toJSON();
					if (_.has(products, 'error') && products.error.toLowerCase() === 'unauthorized') {
						context.$el.hide();
						new LoginView();
					}
					_.each(products, function(product) {
						var container = $('<div />', {'class': 'entry'});
						$('<p />', {text: 'Name: ' + product.name}).appendTo(container);
						$('<p />', {text: 'Price: ' + product.price}).appendTo(container);
						$('<input />', {'class': 'edit-button', value: 'edit', type: 'button'}).appendTo(container);
						$('<input />', {'class': 'remove-button', value: 'remove', type: 'button'}).appendTo(container);
						$('<div />', {'class': 'clear'}).appendTo(container);
						container.appendTo($('#products'));
					});
				}
			});
		},
		events: {
			'click input.remove-button': 'remove'
		},
		remove: function(data) {
			console.log(data);
		}
	});

	var Dish = Backbone.Model.extend({
		url: '/api/dishes',
		defaults: {
			userid: '',
			title: '',
			description: '',
			products: new Products([]),
			directions: ''
		},
		validate: function(attrs) {
			if (!attrs.title)
				return 'Title required';
			if (!attrs.products)
				return 'Select products';
			if (!attrs.directions)
				return 'Directions required';
		},
		initialize: function(model, error) {
			this.bind('error', function(model, error) {
				alert('Model is invalid')
			});
		}
	});

	var DishView = Backbone.View.extend({
		el: $('#new-dish-panel'),
		initialize: function() {
			this.render();
		},
		render: function() {
			var template = _.template($('#new-dish-template').html(), {userid: '94469d0f810c15d47d62c5d71600105c'});
			this.$el.html(template);
			this.$el.show();

			this.$('#product').autocomplete('/api/products/find', {
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
		},
		events: {
			'click #submitDish': 'submitDish'
		},
		submitDish: function(e) {
			e.preventDefault();

			this.model.save({
				userid: $('#userid').val(),
				title: $('#title').val(),
				description: $('#description').val(),
				directions: $('#directions').val()
			}, {
				success: function(model) {
					console.log(model.toJSON());
				},
				error: function(model, err) {
					var errMsg = _.has(err, 'responseText') ? err.responseText : err;
					new ErrorMessage({model: new Error({message: errMsg})});
				}
			});
		}
	});
	
	var Login = Backbone.Model.extend({
		url: '/api/login/',
		defaults: {
			login: '',
			pass: ''
		}
	});
	
	var LoginView = Backbone.View.extend({
		el: $('#login-view'),
		initialize: function() {
			this.render()
		},
		render: function() {
			var template = _.template($('#login-template').html());
			this.$el.html(template).show();
		},
		events: {
			'click input:button': 'login'
		},
		login: function() {
			var context = this;
			var login = new Login();
			
			login.save({
				login: $('#login').val(),
				pass: $('#pass').val()
			}, {
				success: function(model, response) {
					if (response.status === 'successfully authenticated') {
						context.$el.hide();
						new ProductsView({model: new Products()});					
					}
					
					if (_.has(response, 'error') || response.error === 'invalid credentials') {
						new ErrorMessage({model: new Error({message: 'invalid credentials'})});
					}
				}
			});
		}
	});

	var MenuBlocksView = Backbone.View.extend({
		el: $('#menu-blocks'),
		initialize: function() {
			this.render();
		},
		render: function() {
			var template = _.template($('#menu-blocks-template').html(), {});
			this.$el.html(template);
		}
	});

	new MenuBlocksView();		
});