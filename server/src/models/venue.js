/**
 * Venue model - locations where rehearsals can take place
 */
module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    zip: {
      type: DataTypes.STRING
    },
    contactInfo: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    tableName: 'venues'
  });

  Venue.associate = (models) => {
    // Venue can host many rehearsals
    Venue.hasMany(models.Rehearsal, {
      foreignKey: 'venueId',
      as: 'rehearsals'
    });
  };

  return Venue;
};