var Dispatcher = module.exports = function() {
	if( typeof this === 'undefined' || this === module ) {
		return new Dispatcher( handlers );
	}

	this._handlers = {
		post: {},
		get: {},
		put: {},
		delete: {}
	};

	this.dispatch = this.dispatch.bind( this );
};

Dispatcher.prototype = {
	dispatch: function( req, resp ) {
		var method = req.method.toLowerCase(),
			handler = this._matchUri( req.url, this._handlers[method] ),
			params = null;

		if( handler == null ) {
			resp.writeHead( 404 )
			resp.end();
			return;
		}

		params = this._extractParams( req.url, handler );
		params.req = req;
		params.resp = resp;

		process.nextTick((function(){
			this._handle( handler, params );
		}).bind( this ));
	},

	register: function( path, method, cb ) {
		var params = this._extractParamNames( path ),
			path = this._escape( path ),
			path_mask = this._mask( path ),
			method = method.toLowerCase();

		this._handlers[method][path_mask] = {
			params: params,
			path: path,
			mask: new RegExp(path_mask, 'ig'),
			callback: cb
		};
	},

	/* METHOD aliasses */
	post: function( path, cb ) {
		return this.register( path, 'POST', cb );
	},

	get: function( path, cb ) {
		return this.register( path, 'GET', cb );
	},

	put: function( path, cb ) {
		return this.register( path, 'PUT', cb );
	},

	delete: function( path, cb ) {
		return this.register( path, 'DELETE', cb );
	},

	/* PRIVATE */
	_path_mask: /:((\w|-|_)+)/ig,

	_path_escape: /(\\|\+|\?|\{|\}|\[|\]|\(|\))/gi,

	_handlers: null,

	_escape: function( path ) {
		return path.replace( this._path_escape, '\\$1' );
	},

	_mask: function( path ) {
		return path.replace( this._path_mask, '([^/]+)' );
	},

	_extractParams: function( uri, handler ) {
		var values = this._extractValues( uri, handler.mask ),
			keys = handler.params,
			params = {},
			param_count = values.length;

		for( ;param_count--; ) {
			params[keys[param_count]] = values[param_count];
		}

		return params;
	},

	_extractParamNames: function( path ) {
		return this._extractRegex( path, this._path_mask, 1 );
	},

	_matchUri: function( uri, set ) {
		var i = null;

		for( i in set ) {
			i = set[i];

			if( !i.mask )
				continue;

			if( i.mask.test(uri) ) {
				i.mask.lastIndex = 0;
				return i;
			}
		}

		return null;
	},

	_extractValues: function( uri, mask ) {
		var values = mask.exec( uri );
		mask.lastIndex = 0; // reset after use.
		values.shift();
		return values;
	},

	_extractRegex: function( str, regex, key ) {
		var value = null,
			set = [];

		do {
			value = regex.exec( str );

			if( value != null )
				set.push( key ? value[key] : value );
		} while( value != null );

		regex.lastIndex = 0;

		return set;
	},

	_handle: function( handler, params ) {
		handler.callback( params );
	}
}