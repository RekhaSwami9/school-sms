module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin','teacher','student','parent','accountant'), defaultValue: 'student' },
    phone: { type: DataTypes.STRING }
  }, { tableName: 'users', timestamps: true });

  User.associate = function(models) {
    User.hasOne(models.Student, { foreignKey: 'userId', as: 'student' });
  };

  return User;
};
