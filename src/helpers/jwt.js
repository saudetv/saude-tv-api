const jwt = require('jsonwebtoken')

module.exports = {
    async generateToken(user) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
        return token;
    }
};
