const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

// Start the authentication flow
router.get('/auth', authControllers.initiateAuth);

// Callback after Autodesk authentication
router.get('/callback', authControllers.handleCallback);

// Protected test endpoint
router.get('/api/test', authControllers.ensureValidToken, authControllers.testToken);

// Logout
router.get('/logout', authControllers.logout);

module.exports = router;