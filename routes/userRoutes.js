const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

// Get Autodesk Users
router.get('/api/users/acc',
    usersController.getAutodeskUsers);

/*
// Synch users (requires authorization)
router.post('/api/users/sync/:hubId', authControllers.ensureValidToken, usersController.syncUsers);

// Get all users
router.get('/api/users', authControllers.ensureValidToken, usersController.getUsers);

// Get a user by its id
router.get('/api/users/:id', authControllers.ensureValidToken, usersController.getUserById);

// Get a user by its Autodesk id
router.get('/api/users/autodesk/:autodeskId', authControllers.ensureValidToken, usersController.getUserByAutodeskId);
*/
module.exports = router;
