#!/usr/bin/env node

var RecordStore = require('./lib/RecordStore.js'),
	DNSServer = require('./lib/DNS.js'),
	APIServer = require('./lib/API.js'),
	config = require('./config.js'),
	fs = require('fs'),

	records = RecordStore.open(
		config.recordstore.name,
		config.recordstore.type,
		config.recordstore.connection_string ),

	dns = DNSServer( records, config.dns.port ),
	api = null,

	ssl = false;

if( config.api.ssl ) {
	ssl = {
		key: null,
		cert: null
	}

	function startAPI() {
		if( ssl.key  && ssl.cert ) {
			api = APIServer( records, config.api.port, ssl );
		}
	};

	fs.readFile( config.api.ssl.key, function( err, data ) {
		if( err ) { throw err; }

		ssl.key = data;
		startAPI();
	});

	fs.readFile( config.api.ssl.cert, function( err, data ) {
		if( err ) { throw err; }

		ssl.cert = data;
		startAPI();
	});
} else {
	api = APIServer( records, config.api.port );
}

// TODO: Authentication ( per record key? )