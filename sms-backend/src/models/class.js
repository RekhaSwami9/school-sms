module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define(
    "Class",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Grade is required",
          },
        },
      },
      section: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Section is required",
          },
        },
      },
      classTeacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      room: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
        validate: {
          min: {
            args: [1],
            msg: "Capacity must be at least 1",
          },
          max: {
            args: [100],
            msg: "Capacity cannot exceed 100",
          },
        },
      },
      students: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Student count cannot be negative",
          },
        },
      },
      academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "2024-2025",
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive", "Graduated"),
        defaultValue: "Active",
      },
    },
    {
      tableName: "Classes",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["grade", "section", "academicYear"],
        },
      ],
    },
  );

  Class.associate = (models) => {
    Class.belongsTo(models.Teacher, {
      foreignKey: "classTeacherId",
      as: "classTeacher",
    });
  };

  return Class;
};
