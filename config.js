var config = {
	// Configuration of API server
	api: {
		// Port on which the API will listen
		port: 5353,

		// SSL configuration, set to false if no SSL is to be used.
		ssl: {
			key: 'ssl/key.pem',
			cert: 'ssl/cert.pem'
		},

		/* NO SSL
		ssl: false
		*/

		// OAuth2 protection of the API, set to false to disable
		oauth: {
			crypt_key: 'very-very-secret-key',
			sign_key: 'also-a-very-very-secret-key'
		}

		/* NO AUTH
		oauth: false
		*/
	},

	// Configuration of DNS server
	dns: {
		// Port on which DNS requested will be served.
		port: 53
	},

	// Configuration of the recordstore.
	recordstore: {
		// A unique name for the store
		name: 'mysql-store',

		// The type of underlying storage, currently only mysql is supported
		type: 'mysql',

		// The connection string to supply to the driver.
		// mysql://user:pass@server/db-name
		connection_string: 'mysql://dev:dev@localhost/dyndns'
	}
};

module.exports = config;