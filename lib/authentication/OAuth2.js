var OAuth2Provider = null,

	OAuth2 = module.exports = function( options ) {
		if( !options.crypt_key || !options.sign_key )
			throw new Error('A valid crypt_key and sign_key is required for OAuth2.' );

		if( !OAuth2Provider )
			OAuth2Provider = require( 'oauth2-provider' ).OAuth2Provider;

		var oauth = new OAuth2Provider({
				crypt_key: options.crypt_key,
				sign_key: options.sign_key,
			}),
			TTL = options.ttl;

		/**
		 * Checks requests with access tokens.
		 */
		oauth.on('access_token', function( req, token, next ) {
			console.log( '[access_token] checking access token' );

			if( token.grant_date.getTime() + TTL > Date.now() ) {
				req.session.user = token.user_id;
			} else {
				console.warn('access token for user %s has expired', token.user_id );
			}

			next();
		});

		/**
		 * Require the user to login before redirected to the authorize form.
		 */
		oauth.on('enforce_login', function( req, resp, authorize_url, next ) {
			console.log( '[enforce_login] enforcing a login' );
			next( 1 );
		});

		/**
		 * Generate a form for the user.
		 */
		oauth.on('authorize_form', function( req, res, client_id, authorize_url ) {
			console.log( '[authorize_form] generating form.' );
			res.end('<html><body><form action="' + authorize_url +
				'" method="POST"><input type="hidden" name="allow" value="all" />' + 
				'<input type="submit" name="hi" /></form></body></html>');
		});

		/**
		 * Create an access token
		 */
		oauth.on('create_access_token', function( user_id, client_id, next ) {
			console.log( '[create_access_token] creating access token' );
			next(null, {
				user_id: user_id,
				permissions: 'all'
			});
		});

		/**
		 * Save the token that has been generated.
		 */
		oauth.on('save_access_token', function( req, client_id, atok) {
			console.log( '[save_access_token] saving access token' );
		});

		/**
		 * Save a grant
		 */
		oauth.on('save_grant', function( req, client_id, code, next ) {
			console.log( '[save_grant] saving grant' );

			next();
		});

		/**
		 * Find if a grant was given.
		 */
		oauth.on('lookup_grant', function( client_id, client_secret, code, next ) {
			console.log( '[lookup_grant] saving grant' );

			next( null, 1 );
		});

		return oauth;
	}