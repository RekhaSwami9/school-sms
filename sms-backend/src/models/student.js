module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    admission_no: { type: DataTypes.STRING, unique: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    dob: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('male','female','other') },
    class_name: { type: DataTypes.STRING },
    section: { type: DataTypes.STRING }
  }, { tableName: 'students', timestamps: true });

  Student.associate = function(models) {
    Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Student;
};
