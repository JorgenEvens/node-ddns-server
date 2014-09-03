var models = require('../model'),
	config = require('./config'),

	OAuth2Model = {
		getAccessToken: function( bearerToken, callback ) {
			models.AccessToken.findAll({ where: {
				accessToken: bearerToken
			}}).success(function( records ){
				var count = records.length,
					record = null;

				if( !count )
					return callback(null,null);

				record = records.pop();
				record.expires = null;

				callback(null, record);
			});
		},

		getClient: function( clientId, clientSecret, callback ) {
			// TODO: Maybe this should also be stored in database
			if( clientId != config.api.oauth.clientId ||
				clientSecret != config.api.oauth.clientSecret )
				return callback(new Error('Invalid client'));

			callback(null, config.api.oauth);
		},

		grantTypeAllowed: function(clientId, grantType, callback) {
			callback(null, grantType == 'password');
		},

		saveAccessToken: function(accessToken, clientId, expires, user, callback) {
			models.AccessToken.findOrCreate(
				{ accessToken: accessToken, userId: user.id },
				{ data: { accessToken: accessToken, userId: user.id } } )
				.success( function( record, created ) {
					callback();
				})
		},

		getUser: function(username, password, callback) {
			models.User.findAll({ where: {
				username: username,
				password: models.User.hash(password)
			}})
			.success(function( records ) {
				var count = records.length;

				if( !count )
					return callback(null,null);

				callback(null,records.pop());
			})
		}
	};

module.exports = OAuth2Model;