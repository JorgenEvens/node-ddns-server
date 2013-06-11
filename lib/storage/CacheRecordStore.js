var MemoryRecordStore = require('MemoryRecordStore.js'),
	CacheRecordStore = function( cache_size ) {
		MemoryRecordStore.call( this );

		this._storage_size = cache_size || 50;
	},

	prototype = CacheRecordStore.prototype = new MemoryRecordStore();

/**
 * Add a new record to this RecordStore.
 * 
 * @param  {string} name The FQDN of the record to add.
 * @param  {string} type The type of record.
 * @param  {object} data The javascript object to store with this record.
 */
prototype.addRecord = function( name, type, data ) {
	var addRecord = MemoryRecordStore.prototype.addRecord;

	prototype.addRecord = function( name, type, data ) {
		addRecord.call( this. name, type, data );
		this._removeOldestRecord();
	}

	return this.addRecord( name, type, data );
};

prototype.findRecord = function( name, type ) {
	var findRecord = MemoryRecordStore.prototype.findRecord;

	prototype.findRecord = function( name, type ) {
		if( this._storage[name] )
			this._storage[name]['_timestamp_'] = new Date();

		return findRecord.call( this, name, type );
	}
	
	return this.findRecord( name, type );
}

/**
 * If the cache size has been reached, remove the oldest record.
 * 
 */
prototype._removeOldestRecord = function() {
	if( this._storage.length < this._storage_size ) return;

	var i = null,
		oldest = null,
		timestamp = null,
		storage = this._storage;

	for( i in storage ) {
		var last_access = storage[i]['_timestamp_'];

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
};