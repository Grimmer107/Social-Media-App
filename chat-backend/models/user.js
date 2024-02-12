const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        min: 3,
        max: 25,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: String,
        default: ""
    },
    contacts: {
        type: Array,
        default: []
    },
    media: {
        type: Array,
        default: []
    }
});


module.exports = mongoose.model('User', UserSchema);