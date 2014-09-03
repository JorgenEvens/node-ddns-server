var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		username: DataTypes.STRING,
		password: DataTypes.STRING
	},{
		classMethods: {
			associate: function(models) {
				User.hasMany( models.Record, { through: models.Ownership } );
				User.hasMany( models.AccessToken, { foreignKey: 'userId' } );
			}
		}
	});

	User.hash = function( input ) {
		var md5 = crypto.createHash('md5'),
			sha1 = crypto.createHash('sha1');

		md5.update(input);
		sha1.update(md5.digest('hex'));	

		return sha1.digest('hex');
	}

	return User;
}