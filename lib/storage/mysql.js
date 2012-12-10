var mysql = require('mysql'),
	RecordStore = require('../RecordStore.js');

	MysqlRecordStore = function( param ) {
		RecordStore.apply( this );

		this.setupDb( param );
	},

	prototype = {
		_getDb: function() {
			if( !this._connection ) {
				this._connection = mysql.createConnection( this._connection_settings );
			}
			
			return this._connection;
		},

		setupDb: function( connection_settings ) {
			this._connection_settings = connection_settings;
		},

		addRecord: function( name, type, data ) {
			var db = this._getDb(),
				me = this;

			record = {
				name: name,
				type: type,
				data: JSON.stringify( data )
			};

			db.query( 'INSERT INTO records SET ? ON DUPLICATE KEY UPDATE ?', [ record, record ], function( err, rows ) {
				if( err ) {
					console.log( 'Error writing record to database.', err );
					return;
				}

				me.cache.addRecord( name, type, data );
			});
		},

		removeRecord: function( name, type ) {
			var db = this._getDb(),
				me = this;

			db.query( 'DELETE FROM records WHERE name = ? AND type = ?', [name, type], function( err, rows ) {
				if( err ) {
					console.log( 'Error writing record to database.', err );
					return;
				}

				me.cache.removeRecord( name, type );
			});

		},

		findRecord: function( name, type, cb ) {
			var db = this._getDb(),
				me = this,

				cache = this.cache.findRecord( name, type );

			if( cache ) {
				cb( cache );
				return;
			}

			db.query( 'SELECT name, type, data FROM records WHERE name = ? AND type = ?', [name, type], function( err, rows ) {
				var row = rows[0] || null;
				if( err ) {
					console.log( 'Error reading record from database.', err );
					return;
				}

				if( rows.length > 0 ) {
					row.data = JSON.parse( row.data );
					me.cache.addRecord( name, type, row.data );

					cb( row );
				} else {
					cb( null );
				}
			});
		}
	}

	prop = null;

MysqlRecordStore.prototype = new RecordStore();

for( prop in prototype ) {
	MysqlRecordStore.prototype[prop] = prototype[prop];
}

module.exports = {
	create: function( param ) {
		return new MysqlRecordStore( param );
	}
}