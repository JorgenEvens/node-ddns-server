module.exports = function(sequelize, DataTypes) {
	var Record = sequelize.define('Record', {
		id: { type: DataTypes.INTEGER, primaryKey: true },
		name: { type: DataTypes.STRING, unique: 'name-type' },
		type: { type: DataTypes.STRING, unique: 'name-type' },
		data: DataTypes.TEXT
	}, {
		classMethods: {
			associate: function(models) {
				Record.hasMany(models.User, { through: models.Ownership });
			}
		}
	});

	return Record;
}