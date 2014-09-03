module.exports = function(sequelize, DataTypes) {
	var AccessToken = sequelize.define('AccessToken', {
		accessToken: DataTypes.STRING
	});

	return AccessToken;
}