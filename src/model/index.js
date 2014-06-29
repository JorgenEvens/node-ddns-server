var fs = require('fs'),
	path = require('path'),
	config = require('../lib/config'),

	Sequelize = require('sequelize'),

	sequelize = new Sequelize(config.db.connectionstring, config.db.options||{}),
	db = {};

fs.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js');
	})
	.forEach(function(file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if('associate' in db[modelName] )
		db[modelName].associate(db);
});

sequelize.sync();

module.exports = db;