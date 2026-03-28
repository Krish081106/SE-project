const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    darkMode: {
        type: Boolean,
        default: false
    },
    currency: {
        type: String,
        default: 'INR'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
