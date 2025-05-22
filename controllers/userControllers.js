const User = require('../models/userModel')
const axios = require('axios');
const dotenv = require('dotenv');
const { get2LeggedToken } = require('./authControllers');

// Load environment variables
dotenv.config();
const accountId = process.env.ACCOUNT_ID

exports.getAutodeskUsers = async (req, res) => {
    const users = [];
    let offset = 0;
    const limit = 100; // Max users number per page
    try {
        //Get the two legged token
        const token = req.tokenInfo.access_token;

        while (true) {
            const response = await axios.get(`https://developer.api.autodesk.com/hq/v1/accounts/${accountId}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    limit,
                    offset
                }
            });

            const data = response.data;
            if (data.length === 0) {
                break;
            }

            users.push(...data);
            offset += limit;
        }

        res.json({
            success: true,
            data: users || [],
            total: users.length || 0
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
