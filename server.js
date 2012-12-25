#!/usr/bin/env node

var RecordStore = require('./lib/RecordStore.js'),
	DNSServer = require('./lib/DNS.js'),
	APIServer = require('./lib/API.js'),
	fs = require('fs'),

	records = RecordStore.open( 'mysql-store', 'mysql', 'mysql://dev:dev@localhost/dyndns' ),

	dns = DNSServer( records ),
	api = null,

	ssl = {
		key: null,
		cert: null
	},

	startAPI = function() {
		if( ssl.key  && ssl.cert ) {
			api = APIServer( records, 5353, ssl );
		}
	};

fs.readFile( 'ssl/key.pem', function( err, data ) {
	if( err ) { throw err; }

	ssl.key = data;
	startAPI();
});

fs.readFile( 'ssl/cert.pem', function( err, data ) {
	if( err ) { throw err; }

	ssl.cert = data;
	startAPI();
});

// TODO: Authentication ( per record key? )