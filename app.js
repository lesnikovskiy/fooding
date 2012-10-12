var http = require('http');var path = require('path');var express = require('express');var app = module.exports = express();var engine = require('ejs-locals');var cradle = require('cradle');var util = require('util');app.configure(function() {	// use ejs-locals for all ejs templates	app.engine('ejs', engine);	app.set('port', process.env.PORT || 3000);	app.set('views', __dirname + '/views');	app.set('view engine', 'ejs');		app.use(express.favicon());	app.use(express.logger('dev'));	app.use(express.bodyParser());	app.use(express.methodOverride());	app.use(app.router);	app.use(express.static(path.join(__dirname, '/public')));	app.use(express.errorHandler({		dumpExceptions: true, showStack: true	}));});app.get('/', function(req, res) {	res.render('index', {title: 'Fooding', message: 'Fooding'});});app.get('/products/list', function(req, res) {	res.render('products', {title: 'Fooding : Products', message: 'Products'});});app.get('/products/add', function(req, res) {	res.render('productsadd', {		title: 'New Product',		message: 'New Product',		legend: 'New Product',		saveText: 'Add Product'	});});app.get('/dishes/list', function(req, res) {	res.render('dishes', {title: 'Fooding : Dishes', message: 'Dishes', warn: 'to be updated'});});app.get('/dev', function(req,res) {	res.render('dev', {title:'Development & Administration'});});// apivar db = {	host: '127.0.0.1',	port: 5984,	login: 'admin',	password: 'Coffee!12'};function connect(dbname) {	return new(cradle.Connection)(db.host, db.port, {		auth: {			username: db.login,			password: db.password		}	}).database(dbname);}var headers = {	json: {		'Content-Type' : 'application/json'	},	html: {		'Content-Type': 'text/html'	},	plain: {		'Content-Type': 'application/javascript'	}};app.get('/api/products/list/', function(req, res) {	var db = connect('products');	db.view('products/all', function(err, response) {		if (err) {			res.writeHead(200, headers.json);			res.end(JSON.stringify(err));		}				if (response) {			res.writeHead(200, headers.json);			res.end(JSON.stringify(response));		}	});});app.get('/api/products/list/:limit/:skip', function(req, res) {});app.get('/api/products/get/:id', function(req, res) {	var id = req.params.id;});app.post('/api/products/add', function(req, res) {	console.log(util.inspect(req.body));		var db = connect('products');	db.save({		name: req.body.name,		price: req.body.price	}, function(err, response) {		if (err) {			res.writeHead(200, headers.json);			res.end(JSON.stringify(response));		}				if (response) {			res.writeHead(200, headers.json);			res.end(JSON.stringify(response));		}	});});app.post('/api/products/update', function(req, res) {});app.post('/api/products/delete', function(req, res) {});// Database view creationsapp.get('/dev/products/all', function(req, res) {	var db = connect('products');	db.save('_design/products', {		all: {			map: function(doc) {				if (doc.name && doc.price) {					emit(doc._id, {id: doc._id, rev: doc._rev, name: doc.name, price: doc.price});				}			}		}	}, function(err, response) {		if (err) {			res.writeHead(200, headers.plain);			res.end('error occurred: ' + util.inspect(err));		}					if (response) {			res.writeHead(200, headers.plain);			res.end(util.inspect(response));		}	});});http.createServer(app).listen(app.get('port'), function() {	console.log("Express server listening on port " + app.get('port'));});