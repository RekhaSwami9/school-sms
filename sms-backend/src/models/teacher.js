module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      qualification: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      employmentType: {
        type: DataTypes.ENUM("Full-time", "Part-time", "Contract"),
        allowNull: false,
        defaultValue: "Full-time",
      },
      joinDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      subjects: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive", "On Leave"),
        allowNull: false,
        defaultValue: "Active",
      },
    },
    {
      tableName: "teachers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return Teacher;
};
