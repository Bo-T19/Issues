const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const CLIENT_ID = process.env.AUTODESK_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTODESK_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPES =  process.env.SCOPES;

let access_token = '';

const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

app.get('/', (req, res) => {
  const authUrl = `https://developer.api.autodesk.com/authentication/v2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPES)}`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
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

    access_token = response.data.access_token;
    res.send('✅ Autenticado correctamente. ¡Ahora puedes usar el token!');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error al obtener el token.');
  }
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
