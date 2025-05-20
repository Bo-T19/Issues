const axios = require('axios');
const crypto = require('crypto');
const dotenv = require('dotenv');
const { generateRandomState } = require('../utils/securityUtils');

// Load environment variables
dotenv.config();

// Autodesk configuration
const CLIENT_ID = process.env.AUTODESK_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTODESK_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPES = process.env.SCOPES;

// Function that verifies if the token has expired
function isTokenExpired(expiresAt) {
  return Date.now() >= expiresAt;
}

// Function to get a new token using the refresh token
async function refreshAccessToken(refreshToken) {
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await axios.post('https://developer.api.autodesk.com/authentication/v2/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      }
    });
    
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token || refreshToken,
      expires_at: Date.now() + (response.data.expires_in * 1000)
    };
  } catch (error) {
    console.error('Error al refrescar el token:', error.response?.data || error.message);
    throw error;
  }
}

// Middleware that verifies and refreshes the token if necessary
exports.ensureValidToken = async (req, res, next) => {
  if (!req.session.tokenInfo) {
    return res.redirect('/auth');
  }

  // Verify if the token has expired or is about to expire
  if (isTokenExpired(req.session.tokenInfo.expires_at - 300000)) {
    try {
      // Refresh token
      const newTokenInfo = await refreshAccessToken(req.session.tokenInfo.refresh_token);
      req.session.tokenInfo = newTokenInfo;
    } catch (error) {
    // If refresh fails, redirect to the main auth route
      return res.redirect('/auth');
    }
  }
  
  next();
};

// Start the authentication flow
exports.initiateAuth = (req, res) => {
  // Generate and store a random state for CSRF protection
  const state = generateRandomState();
  req.session.authState = state;
  
  const authUrl = `https://developer.api.autodesk.com/authentication/v2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPES)}&state=${state}`;
  res.redirect(authUrl);
};

// Handle the Autodesk callback
exports.handleCallback = async (req, res) => {
  const { code, state } = req.query;
  
  // Verify the state parameter to prevent CSRF attacks
  if (state !== req.session.authState) {
    return res.status(403).send('Error de seguridad: Posible ataque CSRF detectado');
  }
  
  // Clear the session state since it's no longer needed
  req.session.authState = null;
  
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await axios.post('https://developer.api.autodesk.com/authentication/v2/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      }
    });

    // Save the token info in the user's session
    req.session.tokenInfo = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Date.now() + (response.data.expires_in * 1000)
    };
    
    res.send('✅ Autenticado correctamente. ¡Ahora puedes usar el token!');
  } catch (error) {
    console.error('Error al obtener el token:', error.response?.data || error.message);
    res.status(500).send(`Error al obtener el token: ${error.response?.data?.error_description || error.message}`);
  }
};

// Test endpoint to verify the token
exports.testToken = (req, res) => {
  res.json({
    mensaje: 'Token válido',
    token_info: {
      expires_at: new Date(req.session.tokenInfo.expires_at).toISOString(),
      remaining_time: Math.floor((req.session.tokenInfo.expires_at - Date.now()) / 1000) + ' segundos'
    }
  });
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.send('Sesión cerrada. Tokens eliminados.');
};