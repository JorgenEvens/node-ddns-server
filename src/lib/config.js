var fs = require('fs'),
	config = JSON.parse( fs.readFileSync(__dirname + '/../config.json') );

// API Defaults
config.api = config.api || {};
config.api.port = config.api.port || 3000;

// DNS Server Defaults
config.dns = config.dns || {};
config.dns.port = config.dns.port || 53;

// Database defaults
config.db = config.db || {};
config.db.connectionstring = config.db.connectionstring || 'mysql://root:default@localhost/node-ddns';
config.db.options = config.db.options || {};

module.exports = config;