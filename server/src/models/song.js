/**
 * Song model - represents songs in a band's repertoire
 */
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bandId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'bands',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    artist: {
      type: DataTypes.STRING
    },
    key: {
      type: DataTypes.STRING
    },
    tempo: {
      type: DataTypes.INTEGER
    },
    duration: {
      type: DataTypes.INTEGER // Duration in seconds
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    tableName: 'songs'
  });

  Song.associate = (models) => {
    // Song belongs to a band
    Song.belongsTo(models.Band, {
      foreignKey: 'bandId',
      as: 'band'
    });

    // Song can have many attachments
    Song.hasMany(models.SongAttachment, {
      foreignKey: 'songId',
      as: 'attachments'
    });

    // Song can be in many setlists
    Song.belongsToMany(models.Setlist, {
      through: models.SetlistItem,
      foreignKey: 'songId',
      as: 'setlists'
    });
  };

  return Song;
};