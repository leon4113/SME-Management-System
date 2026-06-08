const express = require('express');
const { createUser, getUsers } = require('./users.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

const router = express.Router();

router.post('/', protect, authorize('ADMIN'), createUser);
router.get('/', protect, authorize('ADMIN'), getUsers);

module.exports = router;