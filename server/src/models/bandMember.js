/**
 * BandMember model - junction table for the many-to-many relationship between bands and users
 */
module.exports = (sequelize, DataTypes) => {
  const BandMember = sequelize.define('BandMember', {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'member', 'crew'),
      defaultValue: 'member'
    },
    instrument: {
      type: DataTypes.STRING
    },
    joinDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    tableName: 'band_members'
  });

  return BandMember;
};