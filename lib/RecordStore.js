var RecordStore = module.exports = function() {
		this.cache = new RecordCache();
	},

	RecordCache = function( cache_max_size ) {
		this._cache = {};
		this._cache_size = cache_max_size || 50;
	};

RecordStore.open = function( name, type, connection_param ) {
	if( !RecordStore[name] ) {
		type = require('./storage/' + type + '.js');
		if( type == null ) return null;

		RecordStore[name] = type.create( connection_param );
	}

	return RecordStore[name];
}

RecordCache.prototype = {
	_cache: null,

	_cache_size: 50,

	addRecord: function( name, type, data ) {
		if( !this._cache[name] ) this._cache[name] = {};

		this._cache[name][type] = data;
		this._cache[name]['_timestamp_'] = new Date();
	},

	findRecord: function( name, type ) {
		if( !this._cache[name] ) return null;

		if( this._cache[name][type] ) {
			this._cache[name]['_timestamp_'] = new Date();
			return {
				name: name,
				type: type,
				data: this._cache[name][type]
			};
		}

		return null;
	},

	removeRecord: function( name, type ) {
		if( !type ) {
			delete this._cache[name];
		} else if( this._cache[name] ) {
			delete this._cache[name][type];
		}
	},

	_removeOldestName: function() {
		var oldest = null,
			timestamp = null,
			i = 0,
			cache = this._cache;

		for( i in cache ) {
			var last_access = cache[i]['_timestamp_'];

			if( oldest == null ) {
				oldest = i;
				timestamp = last_access;
			}

			if( timestamp > last_access ) {
				oldest = i;
				timestamp = last_access;
			}
		}

		this.removeRecord( oldest );
	}
}

RecordStore.prototype = {
	cache: null
}