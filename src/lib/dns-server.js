var dns = require('native-dns'),
	models = require('../model'),
	config = require('./config'),

	server = dns.createServer();

server.on('request', function( request, response ) {
	var question = request.question[0],
		qtype = dns.consts.QTYPE_TO_NAME[question.type],
		name = question.name;

	models.Record.findAll({
		where: { type: qtype, name: name }
	}).success(function( records ){
		var count = records.length;

		if( !count ) {
			response.rcode = 3;
			return response.send();
		}

		while( count-- ) {
			response.answer.push(JSON.parse( records[count].data ) );
		}

		response.send();
	})

});

server.serve( config.dns.port );

module.exports = server;