var http = require('http');var path = require('path');var express = require('express');var app = module.exports = express();var engine = require('ejs-locals');var cradle = require('cradle');var util = require('util');var _ = require('underscore');var auth = require('./auth');var products = require('./repositories/products_repository');var dev_rep = require('./repositories/dev_repository');var acc_rep = require('./repositories/accounts_repository');var dish_rep = require('./repositories/dishes_repository');var notes = require('./repositories/notes_repository');var map = require('./repositories/map_repository');app.configure(function() {	// use ejs-locals for all ejs templates	app.engine('ejs', engine);	app.set('port', process.env.PORT || 3000);	app.set('views', __dirname + '/views');	app.set('view engine', 'ejs');		app.use(express.favicon());	app.use(express.logger('dev'));	app.use(express.bodyParser());		app.use(express.methodOverride());		app.use(express.static(path.join(__dirname, '/public')));	// IMPORTANT: use cookieParser before router	app.use(express.cookieParser()); 	app.use(app.router);		app.use(express.errorHandler({		dumpExceptions: true, showStack: true	}));});// Account handlingapp.get('/login', function(req, res) {	res.render('login', {title: 'Login Page'});});app.post('/login', function(req, res) {	if (req.body.login && req.body.pass) {		acc_rep.getAccountByEmail(req.body.login, function(err, response) {			if (response) {				if (_.has(response[0], 'value')) {					var login = _.has(response[0].value, 'email') ? response[0].value.email : '';					var pass = _.has(response[0].value, 'pass') ? response[0].value.pass : '';					if (req.body.login === login && req.body.pass === pass) {								console.log('About to set cookie');						res.cookie('foodingaccess', '1-b8767f0228e22a1d3fe10e12e6d3d656', {httpOnly:true});							console.log('Cookie is set, about to redirect to home page');						res.redirect('/');									}				}			}			if (err)				res.redirect('/login');		});	}	});app.post('/api/login/', function(req, res) {	console.log(req.body);	if (req.body) {		if (_.has(req, 'body') && _.has(req.body, 'login')) {			acc_rep.getAccountByEmail(req.body.login, function(err, response) {						if (response) {					if (_.has(response[0], 'value')) {						var login = _.has(response[0].value, 'email') ? response[0].value.email : '';						var pass = _.has(response[0].value, 'pass') ? response[0].value.pass : '';						if (req.body.login === login && req.body.pass === pass) {							res.cookie('foodingaccess', '1-b8767f0228e22a1d3fe10e12e6d3d656', {httpOnly:true});								res.json({'status': 'successfully authenticated'});									}					}				}				if (err)					res.json({'error': 'invalid credentials'});			});		}	}});app.get('/logout', function(req, res) {	res.clearCookie('foodingaccess');	res.redirect('/login');});app.get('/register', function(req, res) {	res.render('register', {title:'Registration Page'});});app.post('/api/register', function(req, res) {	acc_rep.saveAccount({		firstName: req.body.firstName,		lastName: req.body.lastName,		nick: req.body.nick,		email: req.body.email,		pass: req.body.pass,		bio: req.body.bio ? req.body.bio : '',		location: req.body.location ? req.body.location : '', 		roles: ['user']	}, function(err, response) {		if (err) {			res.json({				'statusCode': '304',				'statusDesc': 'Not Modified',				'location': '/api/products/list/',				'error': err			});		}		if (response) {			res.cookie('foodingaccess', '1-b8767f0228e22a1d3fe10e12e6d3d656', {httpOnly:true});			res.json({				'statusCode': '201',				'statusDesc': 'Created',				'location': '/home',				'message': 'successfully saved',				'response': response			});					}	});});// Home pageapp.get('/', auth.checkAuth, function(req, res) {	res.redirect('index.html');});app.get('/home', auth.checkAuth, function(req, res) {	res.render('index', {title: 'Fooding', message: 'Fooding'});});// Products handlingapp.get('/products/list', auth.checkAuth, function(req, res) {	res.render('products', {		title: 'Fooding : Products', 		message: 'Products',		legend: 'New Product',		saveText: 'Add Product'	});});// apifunction sendApiResponse(res, err, response) {	if (err) {						res.json({			'statusCode': '304',			'statusDesc': 'Not Modified',			'location': '/api/products/list/',			'error': err		});	}	if (response) {		res.json({			'statusCode': '201',			'statusDesc': 'Created',			'location': '/api/products/list/',			'message': 'successfully saved',			'response': response		});	}}app.get('/api/notes', function(req, res) {	notes.all(function(err, response) {		if (err) {			res.json(err);		}		else if (response) {			var notes = [];			_.each(response, function(i) {				notes.push({					id: i.value.id,					rev: i.value.rev,					title: i.value.title,					body: i.value.body				});			});						res.json({				notes: notes			});		}	});});app.post('/api/notes', function(req, res) {	console.log(req.body);	notes.add({		title: req.body.title,		body: req.body.body,		isSync: true	}, function(err, response) {		sendApiResponse(res, err, response);	});});app['delete']('/api/notes', function(req, res) {	console.log(req.body);	notes.remove({		id: req.body.id,		rev: req.body.rev	}, function(err, response) {		sendApiResponse(res, err, response);	});});app.get('/api/map', function(req, res) {		map.all(function(err, response) {		if (err) {			res.json(err);		} else if (response) {			var coords = [];						_.map(response, function(i) {				if (i.value)					coords.push(i.value)			});						res.json({coords: coords});		}	});});app.post('/api/map', function(req, res) {		console.log(req.body);	map.add({		lat: req.body.lat,		lng: req.body.lng,		title: req.body.title,		desc: req.body.desc	}, function (err, response) {		sendApiResponse(res, err, response);	});});app.get('/api/product/list', function(req, res) {	products.all(function(err, response) {		if (err) {			res.json(err);		} else if (response) {			var products = [];			_.each(response, function(item) {				if (_.has(item, 'value')) {					products.push({						id: item.value.id,						rev: item.value.rev,						name: item.value.name,						price: item.value.price					});				}			});			res.json({				products: products			});		}	});});app.post('/api/product', function(req, res) {		products.save({		name: req.body.name,		price: req.body.price	}, function(err, response) {		sendApiResponse(res, err, response);	});});app.put('/api/product', function(req, res) {	products.update({		id: req.body.id,		rev: req.body.rev,		name: req.body.name,		price: req.body.price	}, function(err, response) {		sendApiResponse(res, err, response);	});});app['delete']('/api/product/:id/:rev', function(req, res) {	products.remove({		id: req.params.id,		rev: req.params.rev	}, function(err, response) {		sendApiResponse(res, err, response);	})});app.get('/api/products/list/:limit/:skip', auth.checkApiAuth, function(req, res) {});app.get('/api/products/find', auth.checkApiAuth, function(req, res) {	var key = req.param('q');	products.findByName(key, function(err, response) {		if (err) {			res.json(err);		}		if (response) {			res.json(response);		}	});});app.get('/api/products/get/:id', auth.checkApiAuth, function(req, res) {	var id = req.params.id;	products.get(id, function(err, response) {		if (err) {			res.json(err);		}		if (response) {			res.json(response);		}	});});app.get('/api/products/getbyname/', auth.checkApiAuth, function(req, res) {	var key = req.params('id');	products.findByName(key, function(err, response) {		if (err) {			res.json(err);		}		if (response) {			res.json(response);		}	});});app.post('/api/dishes/save', auth.checkApiAuth, function(req, res) {	dish_rep.saveDish({	}, function(err, response) {		sendApiResponse(res, err, response);	});});// Database view creationsfunction sendDevResponse(res, err, response) {	if (err) {		res.json({			'statusCode': '304',			'statusDesc': 'Not Modified',			'error': err		});	} 	if (response) {		res.json({			'statusCode': '201',			'statusDesc': 'Created',			'response': response		});	}}app.get('/dev', auth.checkAuth, function(req,res) {	res.render('dev', {title:'Development & Administration'});});app.post('/api/dev/products/db', function(req, res) {	dev_rep.createProductsDb(function(err, response) {		sendDevResponse(res, err, response);	});});app.post('/api/dev/products/all', function(req, res) {	dev_rep.createProductsAllView(function(err, response) {		sendDevResponse(res, err, response);	});	});app.post('/api/dev/accounts/db', function(req, res) {	dev_rep.createAccountsDb(function(err, response) {		sendDevResponse(res, err, response);	});});app.post('/api/dev/accounts/all', function(req, res) {	dev_rep.createAccountsAllView(function(err, response) {		sendDevResponse(res, err, response);	});});app.post('/api/dev/accounts/getByEmail', function(req, res) {	dev_rep.createGetAccByEmail(function(err, response) {		sendDevResponse(res, err, response);	});});app.post('/api/dev/products/getByName', function(req, res) {	dev_rep.createFindProductByNameView(function(err, response) {		sendDevResponse(res, err, response);	});});app.post('/api/dev/notes/getnotesview', function(req, res) {	dev_rep.createNotesView(function(err, response) {		sendDevResponse(res, err, response);	});});app.post('/api/dev/map/createcoordsview', function (req, res) {	dev_rep.createMapView(function(err, response) {		sendDevResponse(res, err, response);	});});http.createServer(app).listen(app.get('port'), function() {	console.log("Express server listening on port " + app.get('port'));});