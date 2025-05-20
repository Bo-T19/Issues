const crypto = require('crypto');

// Function to create the random string for the state parameter
exports.generateRandomState = () => {
  return crypto.randomBytes(16).toString('hex');
};