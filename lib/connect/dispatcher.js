var Dispatcher = exports = module.exports = function( handlers ) {
	if( typeof this === 'undefined' || this === module ) {
		return new Dispatcher( handlers );
	}
	var me = this;
	this.connect = function( req, resp ) {
		return me.dispatch( req, resp );
	};

	handlers = handlers || {};

	this.get = handlers.get || {};
	this.post = handlers.post || {};
	this.put = handlers.put || {};
	this.delete = handlers.delete || {};
};

Dispatcher.prototype = {
	dispatch: function( req, resp ) {
		var parts = req.url_parts,
			parts_count = parts.length,
			handlers = this[ req.method.toLowerCase() ] || {},
			handler = handlers[ !parts[0] ? 'index' : parts[0] ],
			i = 1;

		while( handler && i < parts_count-1 ) {
			handler = handlers[ i++ ];
		}

		if( handler ) {
			handler( req, resp );
		} else {
			resp.writeHead( 404 );
			resp.end();
		}
	},

	register: function( method, path, func ) {
		method = method.toLowerCase();
		path = path.split('/');

		var path_count = path.length,
			position = this[method],
			i = 0;

		while( position && i < path_count-1 ) {
			if( !position[ path[i] ] ) {
				position[ path[i] ] = {};
			}
			position = position[ path[i] ];
			i++;
		}

		position[ path[i] ] = func;
	},

	get: null,
	post: null,
	put: null,
	delete: null
}