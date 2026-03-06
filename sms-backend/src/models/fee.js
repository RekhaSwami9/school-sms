module.exports = (sequelize, DataTypes) => {
  const Fee = sequelize.define(
    "Fee",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      feeType: {
        type: DataTypes.ENUM(
          "Tuition",
          "Library",
          "Lab",
          "Sports",
          "Transportation",
          "Exam",
          "Other",
        ),
        allowNull: false,
        defaultValue: "Tuition",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      paidDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.ENUM("Cash", "Card", "Online", "Bank Transfer"),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Partial", "Paid", "Overdue"),
        allowNull: false,
        defaultValue: "Pending",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "fees",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return Fee;
};
