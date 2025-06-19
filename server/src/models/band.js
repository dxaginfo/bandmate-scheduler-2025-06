/**
 * Band model
 */
module.exports = (sequelize, DataTypes) => {
  const Band = sequelize.define('Band', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    logoUrl: {
      type: DataTypes.STRING
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'bands'
  });

  Band.associate = (models) => {
    // Band has many members
    Band.belongsToMany(models.User, {
      through: models.BandMember,
      foreignKey: 'bandId',
      as: 'members'
    });

    // Band was created by a user
    Band.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    // Band has many rehearsals
    Band.hasMany(models.Rehearsal, {
      foreignKey: 'bandId',
      as: 'rehearsals'
    });

    // Band has many songs
    Band.hasMany(models.Song, {
      foreignKey: 'bandId',
      as: 'songs'
    });
  };

  return Band;
};