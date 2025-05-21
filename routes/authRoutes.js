const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

// Start the authentication flow (3-legged)
router.get('/auth', authControllers.initiateAuth);

// Callback after Autodesk authentication
router.get('/callback', authControllers.handleCallback);

// Get 2-legged token directly
router.get('/auth/2legged', authControllers.get2LeggedToken);

// Protected test endpoint (works with both 2-legged and 3-legged)
router.get('/api/test', authControllers.ensureValidToken, authControllers.testToken);

// Logout (for 3-legged)
router.get('/logout', authControllers.logout);

module.exports = router;