const { Rehearsal, Band, BandMember, User, Attendance, Venue } = require('../models');

/**
 * Create a new rehearsal
 */
exports.createRehearsal = async (req, res, next) => {
  try {
    const { 
      bandId, venueId, title, description, 
      startTime, endTime, isRecurring, recurrencePattern 
    } = req.body;
    
    // Check if user is a member of the band
    const membership = await BandMember.findOne({
      where: {
        bandId,
        userId: req.user.id
      }
    });
    
    if (!membership) {
      return res.status(403).json({ message: 'You are not a member of this band' });
    }
    
    // Create rehearsal
    const rehearsal = await Rehearsal.create({
      bandId,
      venueId,
      title,
      description,
      startTime,
      endTime,
      isRecurring,
      recurrencePattern,
      createdBy: req.user.id
    });
    
    // Get all band members
    const bandMembers = await BandMember.findAll({
      where: { bandId }
    });
    
    // Create attendance records for all members
    const attendancePromises = bandMembers.map(member => {
      return Attendance.create({
        rehearsalId: rehearsal.id,
        userId: member.userId,
        status: 'no_response'
      });
    });
    
    await Promise.all(attendancePromises);
    
    res.status(201).json({
      message: 'Rehearsal created successfully',
      rehearsal
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all rehearsals for a band
 */
exports.getBandRehearsals = async (req, res, next) => {
  try {
    const { bandId } = req.params;
    
    // Check if user is a member of the band
    const membership = await BandMember.findOne({
      where: {
        bandId,
        userId: req.user.id
      }
    });
    
    if (!membership) {
      return res.status(403).json({ message: 'You are not a member of this band' });
    }
    
    // Get rehearsals
    const rehearsals = await Rehearsal.findAll({
      where: { bandId },
      include: [
        { model: Venue, as: 'venue' },
        { 
          model: Attendance, 
          as: 'attendances',
          include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }]
        }
      ],
      order: [['startTime', 'ASC']]
    });
    
    res.status(200).json(rehearsals);
  } catch (error) {
    next(error);
  }
};

/**
 * Get rehearsal by ID
 */
exports.getRehearsalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get rehearsal with details
    const rehearsal = await Rehearsal.findByPk(id, {
      include: [
        { model: Band, as: 'band' },
        { model: Venue, as: 'venue' },
        { 
          model: Attendance, 
          as: 'attendances',
          include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }]
        },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    // Check if user is a member of the band
    const membership = await BandMember.findOne({
      where: {
        bandId: rehearsal.bandId,
        userId: req.user.id
      }
    });
    
    if (!membership) {
      return res.status(403).json({ message: 'You are not a member of this band' });
    }
    
    res.status(200).json(rehearsal);
  } catch (error) {
    next(error);
  }
};

/**
 * Update rehearsal
 */
exports.updateRehearsal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      venueId, title, description, startTime, endTime 
    } = req.body;
    
    // Find rehearsal
    const rehearsal = await Rehearsal.findByPk(id);
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    // Check if user is an admin of the band
    const membership = await BandMember.findOne({
      where: {
        bandId: rehearsal.bandId,
        userId: req.user.id
      }
    });
    
    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Only band admins can update rehearsals' });
    }
    
    // Update rehearsal
    await rehearsal.update({
      venueId,
      title,
      description,
      startTime,
      endTime
    });
    
    res.status(200).json({
      message: 'Rehearsal updated successfully',
      rehearsal
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete rehearsal
 */
exports.deleteRehearsal = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find rehearsal
    const rehearsal = await Rehearsal.findByPk(id);
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    // Check if user is an admin of the band
    const membership = await BandMember.findOne({
      where: {
        bandId: rehearsal.bandId,
        userId: req.user.id
      }
    });
    
    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Only band admins can delete rehearsals' });
    }
    
    // Delete rehearsal
    await rehearsal.destroy();
    
    res.status(200).json({
      message: 'Rehearsal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update attendance status for a rehearsal
 */
exports.updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    
    // Find rehearsal
    const rehearsal = await Rehearsal.findByPk(id);
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    // Check if user is a member of the band
    const membership = await BandMember.findOne({
      where: {
        bandId: rehearsal.bandId,
        userId: req.user.id
      }
    });
    
    if (!membership) {
      return res.status(403).json({ message: 'You are not a member of this band' });
    }
    
    // Find or create attendance record
    let attendance = await Attendance.findOne({
      where: {
        rehearsalId: id,
        userId: req.user.id
      }
    });
    
    if (attendance) {
      // Update existing record
      await attendance.update({ status, note });
    } else {
      // Create new record
      attendance = await Attendance.create({
        rehearsalId: id,
        userId: req.user.id,
        status,
        note
      });
    }
    
    res.status(200).json({
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    next(error);
  }
};