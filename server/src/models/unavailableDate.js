/**
 * UnavailableDate model - specific dates when a user is not available
 */
module.exports = (sequelize, DataTypes) => {
  const UnavailableDate = sequelize.define('UnavailableDate', {
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    tableName: 'unavailable_dates'
  });

  UnavailableDate.associate = (models) => {
    // UnavailableDate belongs to a user
    UnavailableDate.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UnavailableDate;
};