#!/usr/bin/env node

var dns = require( 'node-dns' ),
	RecordStore = require('./lib/RecordStore.js'),

	server = dns.createServer(),
	records = RecordStore.open( 'mysql-store', 'mysql', 'mysql://dev:dev@localhost/dyndns' );

server.on( 'request', function( request, response ) {
	var question = request.question[0],
	
		qtype = dns.consts.QTYPE_TO_NAME[question.type],
		name = question.name;

	records.findRecord( name, qtype, function( record ){
		if( !record ) {
			response.rcode = 3;
			return response.send();
		}

		response.answer.push( dns[ record.type ]( record.data ) );

		response.send();
	} );
	
} );

server.serve( 1053 );

// TODO: Write a REST API to add / delete
// TODO: Authentication ( per record key? )