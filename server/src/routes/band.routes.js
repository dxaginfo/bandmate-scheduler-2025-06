const express = require('express');
const router = express.Router();
const bandController = require('../controllers/band.controller');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * /api/bands:
 *   post:
 *     summary: Create a new band
 *     tags: [Bands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Band created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, bandController.createBand);

/**
 * @swagger
 * /api/bands:
 *   get:
 *     summary: Get all bands the user is a member of
 *     tags: [Bands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bands retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, bandController.getUserBands);

/**
 * @swagger
 * /api/bands/{id}:
 *   get:
 *     summary: Get band by ID
 *     tags: [Bands]
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
 *         description: Band retrieved successfully
 *       404:
 *         description: Band not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', auth, bandController.getBandById);

/**
 * @swagger
 * /api/bands/{id}:
 *   put:
 *     summary: Update band
 *     tags: [Bands]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Band updated successfully
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Band not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', auth, bandController.updateBand);

/**
 * @swagger
 * /api/bands/{id}/members:
 *   post:
 *     summary: Add member to band
 *     tags: [Bands]
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 enum: [admin, member, crew]
 *               instrument:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member added successfully
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Band not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/members', auth, bandController.addMember);

/**
 * @swagger
 * /api/bands/{id}/members/{userId}:
 *   delete:
 *     summary: Remove member from band
 *     tags: [Bands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Band or member not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/members/:userId', auth, bandController.removeMember);

module.exports = router;