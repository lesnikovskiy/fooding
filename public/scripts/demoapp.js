// Define the namespace
window.myApp = {};
// Create a Model
// Use Immediately-Invoked Function Expression (IIFE) pattern.
(function (myApp) {
	function Product() {
		var self = this;
		self.sku = ko.observable('');
		self.description = ko.observable('');
		self.price = ko.observable(0.00);
		self.cost = ko.observable(0.00);
		self.quantity = ko.observable(0);
	}
	
	myApp.Product = Product;
})(window.myApp);

// Create a ViewModel
(function(myApp) {
	function ProductsViewModel() {
		var self = this;
		self.selectedProduct = ko.observable();
		self.productCollection = ko.observableArray([]);
		self.addNewProduct = function() {
			var p = new myApp.Product();
			self.selectedProduct(p);
		};
		self.doneEditingProduct = function() {
			var p = new self.selectedProduct();
			
			if (!p)
				return;
				
			// check if already in collection
			if (self.productCollection.indexOf(p) > -1) 
				return;
				
			self.productCollection.push(p);
			
			// clear out the selected product
			self.selectedProduct(null);
		};
		self.removeProduct = function() {
			var p = self.selectedProduct();
			
			if (!p)
				return;
				
			self.selectedProduct(null);
			
			return self.productCollection.remove(p);
		};
	}
	
	myApp.ProductsViewModel = ProductsViewModel;
})(window.myApp);
