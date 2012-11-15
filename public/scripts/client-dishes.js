$(document).ready(function() {
	var Router = Backbone.Router.extend({
		routes: {
			'': 'home',
			'!/': 'home',
			'!/dishes': 'dishes' 
		},
		home: function() {
			$('#menu-blocks').show();
			$('#new-dish-panel').hide();
		},
		dishes: function() {
			$('#menu-blocks').hide();

			var dishModel = new Dish();
			var dishView = new DishView({model: dishModel}); 
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

	var Product = Backbone.Model.extend({
		url: '/products/byname/',
		defaults: {
			name: '',
			price: ''
		}
	});

	var Products = Backbone.Model.extend({
		model: Product
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
			})
		}
	});		
});