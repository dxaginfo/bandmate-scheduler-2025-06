/**
 * Attendance model - tracks user attendance for rehearsals
 */
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rehearsalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'rehearsals',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'declined', 'tentative', 'no_response'),
      defaultValue: 'no_response'
    },
    note: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    tableName: 'attendances'
  });

  Attendance.associate = (models) => {
    // Attendance belongs to a rehearsal
    Attendance.belongsTo(models.Rehearsal, {
      foreignKey: 'rehearsalId',
      as: 'rehearsal'
    });

    // Attendance belongs to a user
    Attendance.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Attendance;
};