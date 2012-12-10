#!/usr/bin/env node

var dns = require( 'node-dns' ),
	RecordStore = require('./lib/RecordStore.js'),

	test = (function(){
		console.log( RecordStore );
	})(),

	server = dns.createServer(),

	my_domain = 'dyn.evens.eu',

	records = RecordStore.open( 'mysql-store', 'mysql', 'mysql://dev:dev@localhost/dyndns' );
	records.addRecord( 'status.dyn.evens.eu', 'A', new dns.A({
		name: 'status',
		address: '159.253.3.124',
		ttl: 300
	}) );

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
// DONE: Write records to DB, flush DB to disk
// TODO: Authentication ( per record key? )