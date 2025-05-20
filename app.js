
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create sessions to save tokens safely
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(20).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Routes
app.use('/', authRoutes);

// Main route
app.get('/', (req, res) => {
  res.send(`
    <h1>Autodesk Platform Services Auth</h1>
    <p>Bienvenido a la aplicación de autenticación</p>
    <a href="/auth">Iniciar autenticación con Autodesk</a>
  `);
});

// Initialize the server
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

module.exports = app;