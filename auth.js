// auth.js

const jwt = require('jsonwebtoken');

function generateToken(user) {
    const token = jwt.sign({ _id: user._id, username: user.username }, 'user');
        // process.env.JWT_SECRET);
    return token;
}

module.exports = generateToken;