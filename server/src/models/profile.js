/**
 * Profile model - extends User with additional information
 */
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
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
    bio: {
      type: DataTypes.TEXT
    },
    phone: {
      type: DataTypes.STRING
    },
    profileImage: {
      type: DataTypes.STRING
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    timestamps: true,
    tableName: 'profiles'
  });

  Profile.associate = (models) => {
    // Profile belongs to a User
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Profile;
};