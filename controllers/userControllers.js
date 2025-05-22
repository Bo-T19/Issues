const User = require('../models/userModel')
const axios = require('axios');
const dotenv = require('dotenv');
const { get2LeggedToken } = require('./authControllers');

// Load environment variables
dotenv.config();
const accountId = process.env.ACCOUNT_ID

exports.getAutodeskUsers = async (req, res) => {

    try {
        //Get the two legged token
        const token = req.tokenInfo.access_token;

        // APS endpoint that gets the user of a specific account
        const url = `https://developer.api.autodesk.com/hq/v1/accounts/${accountId}/users`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        res.json({
            success: true,
            data: response.data || [],
            total: response.data?.length || 0
        });
    } catch (error) {
        console.error('Error al obtener usuarios de Autodesk:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Error al obtener usuarios de Autodesk',
            details: error.response?.data || error.message
        });
    }
}
