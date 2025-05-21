const User = require('../models/userModel')
const axios = require('axios');
const dotenv = require('dotenv');
const { get2LeggedToken } = require('./authControllers');

// Load environment variables
dotenv.config();
const accountId = process.env.ACCOUNT_ID

exports.getAutodeskUsers = async () => {

    try {
        //Get the two legged token
        const tokenInfo = await get2LeggedToken();
        const token = tokenInfo.access_token;

        // APS endpoint that gets the user of a specific account
        const url = `https://developer.api.autodesk.com/hq/v1/accounts/${accountId}/users`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.results || [];
    } catch (error) {
        console.error('Error al obtener usuarios de Autodesk:', error.response?.data || error.message);
        throw error;
    }
}
