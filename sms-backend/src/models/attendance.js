module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("present", "absent", "late", "excused"),
        defaultValue: "present",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      markedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "Attendances",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["studentId", "date"],
        },
      ],
    },
  );

  return Attendance;
};
