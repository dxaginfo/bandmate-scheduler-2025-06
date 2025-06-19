/**
 * Availability model - stores recurring user availability
 */
module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.INTEGER, // 0 = Sunday, 1 = Monday, etc.
      allowNull: false,
      validate: {
        min: 0,
        max: 6
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    repeatWeekly: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'availabilities'
  });

  Availability.associate = (models) => {
    // Availability belongs to a user
    Availability.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Availability;
};