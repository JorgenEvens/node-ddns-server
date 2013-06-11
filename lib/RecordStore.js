var RecordStore = module.exports = function() {},

	prototype = RecordStore.prototype = {},

	notImplemented = function(){
		throw new Error("Method not implemented.");
	};

RecordStore.open = function( name, type, connection_param ) {
	if( !RecordStore[name] ) {
		type = type[0].toUpperCase() + type.substring(1);
		type = require('./storage/' + type + 'RecordStore.js');
		if( type == null ) return null;

		RecordStore[name] = type.create( connection_param );
	}

	return RecordStore[name];
};

prototype.addRecord = 
prototype.findRecord =
prototype.removeRecord = notImplemented;