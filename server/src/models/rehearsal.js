/**
 * Rehearsal model
 */
module.exports = (sequelize, DataTypes) => {
  const Rehearsal = sequelize.define('Rehearsal', {
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
    venueId: {
      type: DataTypes.UUID,
      references: {
        model: 'venues',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurrencePattern: {
      type: DataTypes.JSONB
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
    tableName: 'rehearsals'
  });

  Rehearsal.associate = (models) => {
    // Rehearsal belongs to a band
    Rehearsal.belongsTo(models.Band, {
      foreignKey: 'bandId',
      as: 'band'
    });

    // Rehearsal can be at a venue
    Rehearsal.belongsTo(models.Venue, {
      foreignKey: 'venueId',
      as: 'venue'
    });

    // Rehearsal has many attendances
    Rehearsal.hasMany(models.Attendance, {
      foreignKey: 'rehearsalId',
      as: 'attendances'
    });

    // Rehearsal created by a user
    Rehearsal.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    // Rehearsal can have setlists
    Rehearsal.hasMany(models.Setlist, {
      foreignKey: 'rehearsalId',
      as: 'setlists'
    });
  };

  return Rehearsal;
};