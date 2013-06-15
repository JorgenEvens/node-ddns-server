#!/usr/bin/env node

var RecordStore = require('./lib/RecordStore.js'),
	DNSServer = require('./lib/DNS.js'),
	API = require('./lib/API.js'),
	config = require('./config.js'),
	fs = require('fs'),

	records = RecordStore.open(
		config.recordstore.name,
		config.recordstore.type,
		config.recordstore.connection_string ),

	dns = DNSServer( records, config.dns.port ),
	api = null,
	server = null,

	ssl = false,

	startAPI = function() {
		api = new API({
			'store': records,
			oauth: config.api.oauth
		});

		server
			.on('request', api)
			.listen( config.api.port || ( ssl ? 443 : 80 ) );
	}

if( config.api.ssl ) {
	ssl = {
		key: fs.readFileSync(config.api.ssl.key),
		cert: fs.readFileSync(config.api.ssl.cert)
	};

	server = require('https').createServer( ssl );
} else {
	ssl = false;
	server = require('http').createServer();
}

startAPI();