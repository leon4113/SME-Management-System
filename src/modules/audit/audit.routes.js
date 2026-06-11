const express = require('express');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const { getAuditLogsController } = require('./audit.controller');

const router = express.Router();

router.get('/', protect, authorize('ADMIN'), getAuditLogsController);

module.exports = router;