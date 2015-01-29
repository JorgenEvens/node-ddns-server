var express = require('express'),
	bodyParser = require('body-parser'),
	config = require('./config'),
	controllers = require('../controller'),
	oauth = require('./oauth-server'),

	app = express();

app.use( bodyParser.urlencoded({extended:true}) );

// Helper methods
app.use(function( req, resp, next ) {
	resp.encode = function( data ) {
		resp.end(JSON.stringify(data));
	};
	resp.error = function( message ) {
		resp.encode({
			success: false,
			message: message
		});
	}
	resp.success = function( response ) {
		response = response || {};
		response.success = true;
		resp.encode( response );
	}

	next();
})

// Inject accessToken into request
app.use(function( req, resp, next ){
	if( req.param('accessToken') )
		req.headers['authorization'] = 'Bearer ' + req.param('accessToken');

	next();
});

oauth.attach( app );
controllers.attach( app );

app.listen( config.api.port );

module.exports = app;