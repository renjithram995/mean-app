const jwt = require('jsonwebtoken')

const secretKey = 'mean-course-ram_secret-key'

const tokenValidator = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, secretKey);
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth failed"
        })
    }
}
module.exports = tokenValidator