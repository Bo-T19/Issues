const mongoose = require('mongoose')

//User schema
const userSchema = new mongoose.Schema({
    autodesk_id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    company_name: String,
    last_sync: {
        type: Date,
        default: Date.now
    }
})

//Indexes
userSchema.index({ autodesk_id: 1 });
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema)

module.exports = User