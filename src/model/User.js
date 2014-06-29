module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		username: DataTypes.STRING
	},{
		classMethods: {
			associate: function(models) {
				User.hasMany( models.Record, { through: models.Ownership } );
			}
		}
	});

	return User;
}