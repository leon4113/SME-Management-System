const express = require('express');
const { createUser, getUsers } = require('./users.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const { userValidator } = require('./users.validator')
const { validate } = require('../../middleware/validate')

const router = express.Router();

router.post('/', protect, authorize('ADMIN'), userValidator, validate, createUser);
router.get('/', protect, authorize('ADMIN'), getUsers);

module.exports = router;