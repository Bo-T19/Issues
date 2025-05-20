const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

// Start the authentication flow
router.get('/auth', authController.initiateAuth);

// Callback after Autodesk authentication
router.get('/callback', authController.handleCallback);

// Protected test endpoint
router.get('/api/test', authController.ensureValidToken, authController.testToken);

// Logout
router.get('/logout', authController.logout);

module.exports = router;