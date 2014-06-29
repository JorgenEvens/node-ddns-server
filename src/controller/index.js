var fs = require('fs'),

	attach = function( express, done ) {
		var controllers = fs.readdirSync(__dirname),
			count = controllers.length,
			attach = function( err ) {
				if( err ) return done( err );
				if( count-- == 0 ) return done();

				var c = controllers.pop();
				if( c == 'index.js' ) return attach();

				require('./'+c).attach(express, attach);
			};

		done = done || function(){};
		attach();
	};

module.exports = {
	attach: attach
};