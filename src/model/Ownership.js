module.exports = function(sequelize, DataTypes) {
	var Ownership = sequelize.define('Ownership', {
		type: DataTypes.ENUM('OWNER', 'ADMIN')
	});

	return Ownership;
}