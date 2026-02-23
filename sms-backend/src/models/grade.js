module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define(
    "Grade",
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
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      examType: {
        type: DataTypes.ENUM(
          "quiz",
          "midterm",
          "final",
          "assignment",
          "project",
          "practical",
          "oral",
        ),
        allowNull: false,
      },
      marks: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      maxMarks: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 100,
      },
      grade: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      academicYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      recordedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "Grades",
      timestamps: true,
    },
  );

  return Grade;
};
