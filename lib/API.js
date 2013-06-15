var Dispatcher = require( './connect/dispatcher.js' ),
	dns = require('node-dns'),
	OAuth2Provider = null,
	connect = null,

	/**
	 * options that can be passed along are:
	 *
	 * store: A RecordStore containing the DNS records
	 * oauth: OAuth configuration
	 *  - crypt_key: The crypt key used for OAuth2
	 *  - sign_key: The key used when signing OAuth2 requests
	 * connect: An instance of connect to which the API will be appended ( optional )
	 */

	API = module.exports = function( options ) {
		if( !options.store )
			throw new Error("A valid RecordStore should be supplied");

		if( options.oauth && ( !options.oauth.crypt_key || !options.oauth.sign_key ) )
			throw new Error('A valid crypt_key and sign_key is required for OAuth2.' );

		var store = options.store,
			api = options.connect || false,
			dispatcher = new Dispatcher(),
			auth = null;

		// Enable OAuth2
		if( options.oauth ) {
			OAuth2Provider = require( 'oauth2-provider' ).OAuth2Provider;
			auth = new OAuth2Provider({
				crypt_key: options.oauth && options.oauth.crypt_key,
				sign_key: options.oauth && options.oauth.sign_key,
			});
		}

		// Get connect instance for the API
		if( api === false ) {
			connect = require('connect');

			api = connect()
				.use( connect.bodyParser() )
				.use( connect.query() )
				.use( connect.cookieParser() )
				.use( connect.session({secret: 'ddns-api-secret'}) );
		}

		dispatcher.put( '/:domain/A', function( param ) {
			var domain = param.domain,
				req = param.req,
				resp = param.resp,
				address = req.body.domain || req.connection.remoteAddress;

			store.addRecord( param.domain, 'A', new dns.A({
				type: 1,
				class: 1,
				name: domain,
				address: address,
				ttl: 300
			}), function( success ) {
				resp.end(JSON.stringify({
					success: success
				}));
			})
		});

		dispatcher.get( '/:domain/:type', function( param ) {
			var domain = param.domain,
				type = param.type.toUpperCase(),
				resp = param.resp;

			store.findRecord( param.domain, type, function( record ) {
				resp.write(JSON.stringify( record ));
				resp.end();
			});
		});

		dispatcher.delete( '/:domain/:type', function( param ) {
			store.removeRecord( param.domain, param.type, function( success ){
				resp.end(JSON.stringify({
					success: success
				}));
			})
		});

		if( auth ) {
			api.use( auth.oauth() ).use( auth.login() );
		}

		return api.use( dispatcher.dispatch );
	}