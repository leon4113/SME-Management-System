const express = require('express');
const { login, register } = require('./auth.controller');
const { registerValidator, loginValidator } = require('./auth.validator');
const {validate} = require('../../middleware/validate');

const router = express.Router();

router.post('/login', loginValidator, validate, login);
router.post('/register', registerValidator, validate, register);

module.exports = router;