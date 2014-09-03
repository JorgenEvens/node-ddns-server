var oauth2 = require('oauth2-server'),

	oauth = oauth2({
		model: require('../lib/oauth-model'),
		grants: ['password'],
		accessTokenLifetime: null
	});

exports.attach = function( express ) {
	express.oauth = oauth;
	express.all('/oauth/token', oauth.grant());

	var listen = express.listen;

	express.listen = function() {
		express.use(oauth.errorHandler());
		listen.apply(express,arguments);
	}
}

