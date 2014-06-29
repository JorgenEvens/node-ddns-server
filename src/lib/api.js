var express = require('express'),
	bodyParser = require('body-parser'),
	config = require('./config'),
	controllers = require('../controller'),

	app = express();

app.use( bodyParser.urlencoded({extended:true}) );

controllers.attach( app );

app.listen( config.api.port );

module.exports = app;