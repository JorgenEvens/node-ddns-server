var	dns = require( 'native-dns' );

var DNS = exports = module.exports = function( store, port ) {
	var server = server = dns.createServer();

	port = port || 53;

	server.on( 'request', function( request, response ) {
		var question = request.question[0],
		
			qtype = dns.consts.QTYPE_TO_NAME[question.type],
			name = question.name;

		store.findRecord( name, qtype, function( record ){
			if( !record ) {
				response.rcode = 3;
				return response.send();
			}

			response.answer.push( record );

			response.send();
		} );
		
	});

	server.serve( port );

	return server;
}
	