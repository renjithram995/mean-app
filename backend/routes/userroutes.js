const express = require('express');
const router = express.Router();
const { signupController, loginController } = require('../controllers/user')

router.post('/signup', signupController);

router.post("/login", loginController)

module.exports = router