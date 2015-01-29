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

				resp.success({ records: result });
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

			models.Record.findOrCreate({
				where: { name: domain, type: type },
				defaults: { data: JSON.stringify( record ) }
			})
			.success(function( r, created ) {
				if( created ) {
					models.User.find(req.user.id).success(function(user){
						r.addUser( user );
						resp.success();
					});
					return;
				}
				
				r.hasUser(req.user.id).success(function(has_user){
					console.log(has_user);
					if( !has_user ) {
						return resp.error('Not authorized!');
					}

					r.data = JSON.stringify(record);
					r.save();
				
					resp.success();
				});
			});
		},

		delete: function( req, resp ) {

		}
	};

module.exports = {
	attach: function( express, done ) {
		var oa = express.oauth;

		express.get( '/:domain/:type', record.retrieve );
		express.put( '/:domain/:type', oa.authorise(), record.update );
		express.delete( '/:domain/:type', oa.authorise(), record.delete );
		done();
	}
}