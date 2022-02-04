const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = require('../models/user')

const router = express.Router();

const secretKey = 'mean-course-ram_secret-key'

router.post('/signup', async (req, res) => {
    const encryptedPass = await bcrypt.hash(req.body.password, 12)
    const user = new userSchema({
        email: req.body.email,
        password: encryptedPass,
    });
    user.save().then((result) => {
        res.status(201).json({
            message: 'User added successfully',
            data: {
                id: result._id
            }
        })
    }).catch((error) => {
        res.status(500).json({
            error: error
        })
    })
});

router.post("/login", (req, res) => {
    userSchema.findOne({ email: req.body.email }).then(async (user) => {
        if (!user) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        const isValid = await bcrypt.compare(req.body.password, user.password)
        if (!isValid) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, secretKey, {
            expiresIn: '1h'
        })
        res.status(200).json({
            message: "Auth Success",
            data: {
                token: token
            }
        })
    }).catch((error) => {
        res.status(401).json({
            message: "Auth failed",
            error: error
        })
    })
})

module.exports = router