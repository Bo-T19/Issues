const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

//Connect to Database
mongoose.connect(DB, {}).then(() => console.log('DB connection was successful'))

// Initialize the server
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

