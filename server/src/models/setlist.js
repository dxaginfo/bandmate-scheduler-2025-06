/**
 * Setlist model - a collection of songs for a rehearsal
 */
module.exports = (sequelize, DataTypes) => {
  const Setlist = sequelize.define('Setlist', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rehearsalId: {
      type: DataTypes.UUID,
      references: {
        model: 'rehearsals',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
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
    tableName: 'setlists'
  });

  Setlist.associate = (models) => {
    // Setlist can belong to a rehearsal
    Setlist.belongsTo(models.Rehearsal, {
      foreignKey: 'rehearsalId',
      as: 'rehearsal'
    });

    // Setlist was created by a user
    Setlist.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    // Setlist contains many songs
    Setlist.belongsToMany(models.Song, {
      through: models.SetlistItem,
      foreignKey: 'setlistId',
      as: 'songs'
    });
  };

  return Setlist;
};