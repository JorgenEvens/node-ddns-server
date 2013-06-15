var MemoryRecordStore = function(){
		this._storage = {};
	},

	RecordStore = require('../RecordStore.js'),

	prototype = new RecordStore(),

	prop = null;

MemoryRecordStore.prototype = prototype;

prototype._storage = null;

/**
 * Add a new record to this RecordStore.
 * 
 * @param  {string} name The FQDN of the record to add.
 * @param  {string} type The type of record.
 * @param  {object} data The javascript object to store with this record.
 */
prototype.addRecord = function( name, type, data ) {
	if( !this._storage[name] ) this._storage[name] = {};

	this._storage[name][type] = data;
};

/**
 * Find the record with the specified name and type.
 * 
 * @param  {string} name The FQDN of the record to find.
 * @param  {string} type The type of record to retrieve.
 * @return {object}      The javascript object storred for this record.
 */
prototype.findRecord = function( name, type ) {
	if( !this._storage[name] )
		return null;

	if( this._storage[name][type] )
		return this._storage[name][type];

	return null;
};

/**
 * Remove the record with the specified name and type.
 * 
 * @param  {string} name The FQDN of the record to find.
 * @param  {string} type The type of record to retrieve.
 */
prototype.removeRecord = function( name, type ) {
	if( !type ) {
		delete this._storage[name];
	} else if( this._storage[name] ) {
		delete this._storage[name][type];
	}
};

	prop = null;

MemoryRecordStore.prototype = new RecordStore();

for( prop in prototype ) {
	MemoryRecordStore.prototype[prop] = prototype[prop];
}

module.exports = exports = MemoryRecordStore;
