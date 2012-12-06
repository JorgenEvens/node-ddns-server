var RecordStore = exports = function() {};

RecordStore.open = function( name, type, connection_param ) {
	if( !RecordStore[name] ) {
		type = require('storage/mysql.js');
		if( type == null ) return null;

		RecordStore[name] = type.create( connection_param );
	}

	return RecordStore[name];
}