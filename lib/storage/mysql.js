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

		addRecord: function( domain, name, type, data ) {
			var db = this._getDb();

			record = {
				domain: domain,
				name: name,
				type: type,
				data: data
			};
			db.query( 'INSERT INTO records SET ? ON DUPLICATE KEY UPDATE ?', [ record, record ], function( err, rows ) {
				if( err ) {
					console.log( 'Error writing record to database.', err );
					return;
				}
			});
		},

		removeRecord: function( domain, name, type ) {
			var db = this._getDb();

			db.query( 'DELETE FROM records WHERE domain = ? AND name = ? AND type = ?', [ domain, name, type ], function( err, rows ) {
				if( err ) {
					console.log( 'Error writing record to database.', err );
					return;
				}
			});

		},

		findRecord: function( domain, name, type, cb ) {
			var db = this._getDb();

			var q = db.query( 'SELECT name, type, data FROM records WHERE domain = ? AND name = ? AND type = ?', [domain, name, type], function( err, rows ) {
				if( err ) {
					console.log( 'Error reading record from database.', err );
					return;
				}
				console.log( rows, rows.length );
				if( rows.length > 0 ) {
					cb( rows[0] );
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