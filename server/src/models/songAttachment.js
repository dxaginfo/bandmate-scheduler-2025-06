/**
 * SongAttachment model - files attached to songs (sheet music, audio files, etc.)
 */
module.exports = (sequelize, DataTypes) => {
  const SongAttachment = sequelize.define('SongAttachment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    songId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'songs',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
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
    tableName: 'song_attachments'
  });

  SongAttachment.associate = (models) => {
    // SongAttachment belongs to a song
    SongAttachment.belongsTo(models.Song, {
      foreignKey: 'songId',
      as: 'song'
    });

    // SongAttachment was created by a user
    SongAttachment.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  };

  return SongAttachment;
};