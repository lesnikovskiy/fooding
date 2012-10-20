var http = require('http');var path = require('path');var express = require('express');var app = module.exports = express();var engine = require('ejs-locals');var cradle = require('cradle');var util = require('util');var products = require('./repositories/products_repository');var dev_rep = require('./repositories/dev_repository');app.configure(function() {	// use ejs-locals for all ejs templates	app.engine('ejs', engine);	app.set('port', process.env.PORT || 3000);	app.set('views', __dirname + '/views');	app.set('view engine', 'ejs');		app.use(express.favicon());	app.use(express.logger('dev'));	app.use(express.bodyParser());		app.use(express.methodOverride());		app.use(express.static(path.join(__dirname, '/public')));	app.use(app.router);	app.use(express.cookieParser());	app.use(express.errorHandler({		dumpExceptions: true, showStack: true	}));});app.get('/', function(req, res) {	res.render('index', {title: 'Fooding', message: 'Fooding'});});app.get('/products/list', function(req, res) {	res.render('products', {		title: 'Fooding : Products', 		message: 'Products',		legend: 'New Product',		saveText: 'Add Product'	});});app.get('/products/add', function(req, res) {	res.render('productsadd', {		title: 'Fooding : New Product',		message: 'New Product',		legend: 'New Product',		saveText: 'Add Product'	});});app.get('/dishes/list', function(req, res) {	res.render('dishes', {title: 'Fooding : Dishes', message: 'Dishes', warn: 'to be updated'});});// apiapp.get('/api/products/list/', function(req, res) {	products.all(function(err, response) {		if (err) {			res.json(JSON.stringify(err));		} else if (response) {			res.json(JSON.stringify(response));		}	});});app.get('/api/products/list/:limit/:skip', function(req, res) {});app.get('/api/products/get/:id', function(req, res) {	var id = req.params.id;});app.post('/api/products/add', function(req, res) {		products.save({		name: req.body.name,		price: req.body.price	}, function(err, response) {		if (err) {							res.json({				'statusCode': '304',				'statusDesc': 'Not Modified',				'location': '/api/products/list/',				'error': err			});		} else if (response) {			res.json({				'statusCode': '201',				'statusDesc': 'Created',				'location': '/api/products/list/',				'message': 'successfully saved',				'response': response			});		}	});});app.post('/api/products/update', function(req, res) {});app.post('/api/products/delete', function(req, res) {});// Database view creationsapp.get('/dev', function(req,res) {	res.render('dev', {title:'Development & Administration'});});app.get('/dev/products/all', function(req, res) {	dev_rep.createProductsAllView(function(err, response) {		if (err) {			console.log(util.inspect(err));			res.json({				'statusCode': '304',				'statusDesc': 'Not Modified',				'error': err			});		}		if (response) {			console.log(util.inspect(response));			res.json({				'statusCode': '201',				'statusDesc': 'Created',				'response': response			});		}	});	});http.createServer(app).listen(app.get('port'), function() {	console.log("Express server listening on port " + app.get('port'));});