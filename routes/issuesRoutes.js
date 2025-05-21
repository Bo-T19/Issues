const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

// Get the issues of a specific project
router.get('/api/issues/:id', authController.ensureValidToken);

module.exports = router;