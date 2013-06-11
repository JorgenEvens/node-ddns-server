var Dispatcher = require( './connect/dispatcher.js' ),
	OAuth2Provider = require( 'oauth2-provider').OAuth2Provider,
	connect = require( 'connect' ),
	dns = require('node-dns'),

	API = exports = module.exports = function( store, port, ssl ) {
		var api = connect(),
			http = require( ssl ? 'https' : 'http' ),
			server = ssl ? http.createServer( ssl, api ) : http.createServer( api ),

			dispatcher = new Dispatcher({
				"put": {
					"update": function( req, resp ) {
						if( !req.body.key ) {
							resp.writeHead( 403 );
							return resp.end();
						}

						store.addRecord( req.body.domain, 'A', new dns.A({
							type: 1,
							class: 1,
							name: req.body.domain,
							address: req.body.address || req.connection.remoteAddress,
							ttl: 300
						}), function( success ) {
							resp.end(JSON.stringify({success: success}));
						});
					}
				},

				"delete": {
					"remove": function( req, resp ) {
						if( !req.body.key ) {
							resp.writeHead( 403 );
							return resp.end();
						}

						store.removeRecord( req.body.domain, 'A', function( success ) {
							resp.end(JSON.stringify({success: success}));
						});
					}
				}
			}),

			OAuth = new OAuth2Provider({
				crypt_key: 'very-secret-key-goes-here',
				sign_key: 'very-secret-signing-key'
			})

		api.use( connect.bodyParser() )
			.use( connect.query() )
			.use( require( './connect/explode_url.js' ) );


			.use( dispatcher.connect );

		server.listen( port || ( ssl ? 443 : 80 ) );

		return api;
	}

API = exports = module.exports = function() {


	
}

API.prototype = {
	_dispatcher: null,

	connect: function( instance ) {
		instance
			.use( './connect/explode_url.js' )
			.use( this._dispatcher.handle );
	}
}