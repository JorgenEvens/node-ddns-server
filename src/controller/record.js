var models = require('../model'),
	dns = require('native-dns'),

	record = {
		retrieve: function( req, resp ) {
			var result = [],
				domain = req.param('domain'),
				type = req.param('type');

			models.Record.findAll({ where: {
				name: domain,
				type: type.toUpperCase()
			}}).success(function( records ){
				var count = records.length;

				while( count-- )
					result.push(JSON.parse( records[count].data ));

				resp.end( JSON.stringify( result ) );
			})
		},

		update: function( req, resp ) {
			var domain = req.param('domain'),
				type = req.param('type').toUpperCase(),
				target = req.body.data || req.connection.remoteAddress,
				ttl = req.body.ttl || 300,

				record = {
					type: dns.consts.NAME_TO_QTYPE[type],
					class: 1,
					name: domain,
					ttl: ttl
				};

			if( type == 'A' ) {
				record.address = target;
			} else if( type == 'MX' ) {
				record.priority = req.body.priority || 10;
				record.exchange = target;
			} else {
				record.data = target;
			}

			record = new dns[type](record);

			models.Record.findOrCreate(
				{ name: domain, type: type },
				{ data: JSON.stringify( record ) } )
				.success(function( record, created ) {
					if( !created ) {
						record.data = JSON.stringify(record);
						record.save();
					}

					resp.end( JSON.stringify({ success: true }) );
				});
		},

		delete: function( req, resp ) {

		}
	};

module.exports = {
	attach: function( express, done ) {
		express.get( '/:domain/:type', record.retrieve );
		express.put( '/:domain/:type', record.update );
		express.delete( '/:domain/:type', record.delete );
		done();
	}
}