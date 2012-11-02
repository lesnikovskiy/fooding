var http = require('http');var path = require('path');var express = require('express');var app = module.exports = express();var engine = require('ejs-locals');var cradle = require('cradle');var util = require('util');var _ = require('underscore');var auth = require('./auth');var products = require('./repositories/products_repository');var dev_rep = require('./repositories/dev_repository');app.configure(function() {	// use ejs-locals for all ejs templates	app.engine('ejs', engine);	app.set('port', process.env.PORT || 3000);	app.set('views', __dirname + '/views');	app.set('view engine', 'ejs');		app.use(express.favicon());	app.use(express.logger('dev'));	app.use(express.bodyParser());		app.use(express.methodOverride());		app.use(express.static(path.join(__dirname, '/public')));	// IMPORTANT: use cookieParser before router	app.use(express.cookieParser()); 	app.use(app.router);		app.use(express.errorHandler({		dumpExceptions: true, showStack: true	}));});app.get('/login', function(req, res) {	res.render('login', {title: 'Login Page'});});app.post('/login', function(req, res) {	console.log(util.inspect(req.body));	if (req.body.login && req.body.pass) {		if (req.body.login === 'admin' && req.body.pass === 'Coffee!12') {			res.cookie('foodingaccess', '1-b8767f0228e22a1d3fe10e12e6d3d656', {httpOnly:true});			res.redirect('/');		}	}});app.get('/logout', function(req, res) {	res.clearCookie('foodingaccess');	res.redirect('/login');});app.get('/register', function(req, res) {	res.render('register', {title:'Registration Page'});});app.get('/', auth.checkAuth, function(req, res) {	res.render('index', {title: 'Fooding', message: 'Fooding'});});app.get('/products/list', auth.checkAuth, function(req, res) {	res.render('products', {		title: 'Fooding : Products', 		message: 'Products',		legend: 'New Product',		saveText: 'Add Product'	});});app.get('/dishes/list', auth.checkAuth, function(req, res) {	res.render('dishes', {title: 'Fooding : Dishes', message: 'Dishes', warn: 'to be updated'});});// apifunction sendApiResponse(res, err, response) {	if (err) {						res.json({			'statusCode': '304',			'statusDesc': 'Not Modified',			'location': '/api/products/list/',			'error': err		});	} else if (response) {		res.json({			'statusCode': '201',			'statusDesc': 'Created',			'location': '/api/products/list/',			'message': 'successfully saved',			'response': response		});	} else {		res.json({			'statusCode': '304',			'statusDesc': 'Not Modified',			'location': '/api/products/list/',			'error': {error: 'unkown',reason:'unkown'}		});	}}app.get('/api/products/list/', auth.checkApiAuth, function(req, res) {	products.all(function(err, response) {		if (err) {			res.json(err);		} else if (response) {			res.json(response);		}	});});app.get('/api/products/list/:limit/:skip', auth.checkApiAuth, function(req, res) {});app.get('/api/products/get/:id', auth.checkApiAuth, function(req, res) {	var id = req.params.id;	products.get(id, function(err, response) {		if (err) {			res.json(err);		}		if (response) {			res.json(response);		}	});});app.post('/api/products/add', auth.checkApiAuth, function(req, res) {		products.save({		name: req.body.name,		price: req.body.price	}, function(err, response) {		sendApiResponse(res, err, response);	});});app.post('/api/products/update', auth.checkApiAuth, function(req, res) {	products.update({		id: req.body.id,		rev: req.body.rev,		name: req.body.name,		price: req.body.price	}, function(err, response) {		sendApiResponse(res, err, response);	});});app.post('/api/products/remove', auth.checkApiAuth, function(req, res) {	products.remove({		id: req.body.id,		rev: req.body.rev	}, function(err, response) {		sendApiResponse(res, err, response);	})});// Database view creationsfunction sendDevResponse(res, err, response) {	if (err) {		console.log(util.inspect(err));		res.json({			'statusCode': '304',			'statusDesc': 'Not Modified',			'error': err		});	}	if (response) {		console.log(util.inspect(response));		res.json({			'statusCode': '201',			'statusDesc': 'Created',			'response': response		});	}}app.get('/dev', auth.checkAuth, function(req,res) {	res.render('dev', {title:'Development & Administration'});});app.post('/api/dev/products/all', function(req, res) {	dev_rep.createProductsAllView(function(err, response) {		sendDevResponse(res, err, response);	});	});app.post('/api/dev/accounts/all', function(req, res) {	dev_rep.createAccountsAllView(function(err, response) {		sendDevResponse(res, err, response);	});});http.createServer(app).listen(app.get('port'), function() {	console.log("Express server listening on port " + app.get('port'));});