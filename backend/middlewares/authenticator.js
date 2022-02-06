const jwt = require('jsonwebtoken')

const secretKey = 'mean-course-ram_secret-key'

const tokenValidator = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secretKey);
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        }
        next();
    } catch (error) {
        res.status(401).json({
            message: "User authentication Failed"
        })
    }
}
module.exports = tokenValidator