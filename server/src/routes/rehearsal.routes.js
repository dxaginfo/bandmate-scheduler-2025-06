const express = require('express');
const router = express.Router();
const rehearsalController = require('../controllers/rehearsal.controller');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * /api/rehearsals:
 *   post:
 *     summary: Create a new rehearsal
 *     tags: [Rehearsals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bandId
 *               - title
 *               - startTime
 *               - endTime
 *             properties:
 *               bandId:
 *                 type: string
 *                 format: uuid
 *               venueId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               isRecurring:
 *                 type: boolean
 *               recurrencePattern:
 *                 type: object
 *     responses:
 *       201:
 *         description: Rehearsal created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', auth, rehearsalController.createRehearsal);

/**
 * @swagger
 * /api/rehearsals/band/{bandId}:
 *   get:
 *     summary: Get all rehearsals for a band
 *     tags: [Rehearsals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bandId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rehearsals retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.get('/band/:bandId', auth, rehearsalController.getBandRehearsals);

/**
 * @swagger
 * /api/rehearsals/{id}:
 *   get:
 *     summary: Get rehearsal by ID
 *     tags: [Rehearsals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rehearsal retrieved successfully
 *       404:
 *         description: Rehearsal not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.get('/:id', auth, rehearsalController.getRehearsalById);

/**
 * @swagger
 * /api/rehearsals/{id}:
 *   put:
 *     summary: Update rehearsal
 *     tags: [Rehearsals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               venueId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Rehearsal updated successfully
 *       404:
 *         description: Rehearsal not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.put('/:id', auth, rehearsalController.updateRehearsal);

/**
 * @swagger
 * /api/rehearsals/{id}:
 *   delete:
 *     summary: Delete rehearsal
 *     tags: [Rehearsals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rehearsal deleted successfully
 *       404:
 *         description: Rehearsal not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.delete('/:id', auth, rehearsalController.deleteRehearsal);

/**
 * @swagger
 * /api/rehearsals/{id}/attendance:
 *   post:
 *     summary: Update attendance status for a rehearsal
 *     tags: [Rehearsals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, declined, tentative]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       404:
 *         description: Rehearsal not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/attendance', auth, rehearsalController.updateAttendance);

module.exports = router;