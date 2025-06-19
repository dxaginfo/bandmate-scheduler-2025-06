/**
 * SetlistItem model - junction table for the many-to-many relationship between setlists and songs
 */
module.exports = (sequelize, DataTypes) => {
  const SetlistItem = sequelize.define('SetlistItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    setlistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'setlists',
        key: 'id'
      }
    },
    songId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'songs',
        key: 'id'
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    tableName: 'setlist_items'
  });

  return SetlistItem;
};