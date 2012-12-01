#!/usr/bin/env node

var dns = require( 'node-dns' ),
	server = dns.createServer(),

	my_domain = 'dyn.evens.eu',

	records = {
		status: dns.A({
			name: 'status',
			address: '159.253.3.124',
			ttl: 300
		})
	};

server.on( 'request', function( request, response ) {
	var name = request.question[0].name.replace( '.' + my_domain, '' );
	console.log( 'Request for: ', name );

	if( !records[name] ) {
		response.rcode = 3;
		return response.send();
	}

	response.answer.push( records[name] );
	response.send();
} );

server.serve( 1053 );

// TODO: Write a REST API to add / delete
// TODO: Write records to DB, flush DB to disk
// TODO: Authentication ( per record key? )