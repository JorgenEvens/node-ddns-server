#!/usr/bin/env node

var dns = require( 'node-dns' ),
	RecordStore = require('./lib/RecordStore.js'),

	test = (function(){
		console.log( RecordStore );
	})(),

	server = dns.createServer(),

	my_domain = 'dyn.evens.eu',

	records = RecordStore.open( 'mysql-store', 'mysql', 'mysql://dev:dev@localhost/dyndns' );
	records.addRecord( 'dyn.evens.eu', 'status', 'A', '159.253.3.124' );

server.on( 'request', function( request, response ) {
	var question = request.question[0],
		qtype = dns.consts.QTYPE_TO_NAME[question.type],
		name = question.name.replace( '.' + my_domain, '' );

	records.findRecord( my_domain, name, qtype, function( record ){
		if( !record ) {
			response.rcode = 3;
			return response.send();
		}

		response.answer.push( dns[record.type]({
			name: name + '.' + my_domain,
			address: record.data.toString(),
			data: this.address,
			ttl: 300
		}));

		response.send();
	} );
	
} );

server.serve( 1053 );

// TODO: Write a REST API to add / delete
// DONE: Write records to DB, flush DB to disk
// TODO: Authentication ( per record key? )