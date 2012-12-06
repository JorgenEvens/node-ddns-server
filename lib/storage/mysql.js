var mysql = require('mysql'),

	MysqlRecordStore = function( param ) {
		this.setupDb( param );
	};

	MysqlRecordStore.prototype = {
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
			var db = this._getDb();

			record = {
				name: name,
				type: type,
				data: data
			};
			db.query( 'INSERT INTO records( name, type, data ) VALUES( ? )', record, function( err, rows ) {
				if( err ) {
					console.log( 'Error writing record to database.', err );
					return;
				}
			});
		},

		removeRecord: function( name ) {
			var db = this._getDb();

			db.query( 'DELETE FROM records WHERE ?', { name: name }, function( err, rows ) {
				if( err ) {
					console.log( 'Error writing record to database.', err );
					return;
				}
			});

		},

		findRecord: function( name, cb ) {
			var db = this._getDb();

			filter = { name: name };
			db.query( 'SELECT name, type, data FROM records WHERE ?', filter, function( err, rows ) {
				if( err ) {
					console.log( 'Error writing record to database.', err );
					return;
				}

				if( rows.length > 0 ) {
					cb( rows[0] );
				}
			});
		}
	};

exports = {
	create: function( param ) {
		return new MysqlRecordStore( param );
	}
}