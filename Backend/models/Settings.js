const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    UserId: {
        // Connect to an Id in another Model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    Settings: {
        type: Object,
        required: true,
        default: null
    },
    DateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    DateUpdated: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = Settings = mongoose.model('settings', SettingsSchema);