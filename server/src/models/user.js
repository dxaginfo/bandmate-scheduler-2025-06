/**
 * User model
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'users'
  });

  User.associate = (models) => {
    // User can have one profile
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile'
    });

    // User can be a member of many bands
    User.belongsToMany(models.Band, {
      through: models.BandMember,
      foreignKey: 'userId',
      as: 'bands'
    });

    // User can create many bands
    User.hasMany(models.Band, {
      foreignKey: 'createdBy',
      as: 'createdBands'
    });

    // User can have many availabilities
    User.hasMany(models.Availability, {
      foreignKey: 'userId',
      as: 'availabilities'
    });

    // User can have many unavailable dates
    User.hasMany(models.UnavailableDate, {
      foreignKey: 'userId',
      as: 'unavailableDates'
    });
  };

  return User;
};