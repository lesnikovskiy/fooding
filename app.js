var http = require('http');var path = require('path');var express = require('express');var app = module.exports = express();app.configure(function() {	app.set('port', process.env.PORT || 3000);	app.set('views', __dirname + '/views');	app.set('view engine', 'ejs');		app.use(express.favicon());	app.use(express.logger('dev'));	app.use(express.bodyParser());	app.use(express.methodOverride());	app.use(app.router);	app.use(express.static(path.join(__dirname, '/public')));	app.use(express.errorHandler({		dumpExceptions: true, showStack: true	}));});app.get('/', function(req, res) {	res.render('construction', {title: 'Cooking', message: 'Site under construction'});});http.createServer(app).listen(app.get('port'), function() {	console.log("Express server listening on port " + app.get('port'));});