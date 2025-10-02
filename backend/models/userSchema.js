const mongoose = require('mongoose'); // ✅ Correct


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const UserSchema = mongoose.model('User', userSchema);

module.exports = UserSchema;