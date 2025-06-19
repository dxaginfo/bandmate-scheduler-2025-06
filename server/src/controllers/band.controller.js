const { Band, User, BandMember } = require('../models');

/**
 * Create a new band
 */
exports.createBand = async (req, res, next) => {
  try {
    const { name, description, logoUrl } = req.body;
    
    // Create band
    const band = await Band.create({
      name,
      description,
      logoUrl,
      createdBy: req.user.id
    });
    
    // Add creator as admin member
    await BandMember.create({
      bandId: band.id,
      userId: req.user.id,
      role: 'admin'
    });
    
    res.status(201).json({
      message: 'Band created successfully',
      band
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bands the user is a member of
 */
exports.getUserBands = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Band,
        as: 'bands',
        through: { attributes: ['role', 'instrument'] }
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.bands);
  } catch (error) {
    next(error);
  }
};

/**
 * Get band by ID
 */
exports.getBandById = async (req, res, next) => {
  try {
    const band = await Band.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'members',
        through: { attributes: ['role', 'instrument'] },
        attributes: { exclude: ['password'] }
      }]
    });
    
    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }
    
    // Check if user is a member of the band
    const isMember = await BandMember.findOne({
      where: {
        bandId: band.id,
        userId: req.user.id
      }
    });
    
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this band' });
    }
    
    res.status(200).json(band);
  } catch (error) {
    next(error);
  }
};

/**
 * Update band
 */
exports.updateBand = async (req, res, next) => {
  try {
    const { name, description, logoUrl } = req.body;
    
    // Find band
    const band = await Band.findByPk(req.params.id);
    
    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }
    
    // Check if user is admin of the band
    const membership = await BandMember.findOne({
      where: {
        bandId: band.id,
        userId: req.user.id
      }
    });
    
    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Only band admins can update band details' });
    }
    
    // Update band
    await band.update({
      name,
      description,
      logoUrl
    });
    
    res.status(200).json({
      message: 'Band updated successfully',
      band
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to band
 */
exports.addMember = async (req, res, next) => {
  try {
    const { userId, role = 'member', instrument } = req.body;
    
    // Find band
    const band = await Band.findByPk(req.params.id);
    
    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }
    
    // Check if user is admin of the band
    const membership = await BandMember.findOne({
      where: {
        bandId: band.id,
        userId: req.user.id
      }
    });
    
    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Only band admins can add members' });
    }
    
    // Check if user exists
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already a member
    const existingMember = await BandMember.findOne({
      where: {
        bandId: band.id,
        userId
      }
    });
    
    if (existingMember) {
      return res.status(409).json({ message: 'User is already a member of this band' });
    }
    
    // Add user to band
    const bandMember = await BandMember.create({
      bandId: band.id,
      userId,
      role,
      instrument
    });
    
    res.status(201).json({
      message: 'Member added successfully',
      bandMember
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from band
 */
exports.removeMember = async (req, res, next) => {
  try {
    const { id: bandId, userId } = req.params;
    
    // Find band
    const band = await Band.findByPk(bandId);
    
    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }
    
    // Check if user is admin of the band
    const membership = await BandMember.findOne({
      where: {
        bandId,
        userId: req.user.id
      }
    });
    
    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Only band admins can remove members' });
    }
    
    // Find member to remove
    const memberToRemove = await BandMember.findOne({
      where: {
        bandId,
        userId
      }
    });
    
    if (!memberToRemove) {
      return res.status(404).json({ message: 'Member not found in this band' });
    }
    
    // Check if trying to remove the last admin
    if (memberToRemove.role === 'admin') {
      const adminCount = await BandMember.count({
        where: {
          bandId,
          role: 'admin'
        }
      });
      
      if (adminCount <= 1) {
        return res.status(403).json({ message: 'Cannot remove the last admin of the band' });
      }
    }
    
    // Remove member
    await memberToRemove.destroy();
    
    res.status(200).json({
      message: 'Member removed successfully'
    });
  } catch (error) {
    next(error);
  }
};