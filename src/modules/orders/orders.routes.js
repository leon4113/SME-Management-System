const express = require('express');
const { createOrder, getOrders } = require('./orders.controller');
const { protect } = require('../../middleware/auth')
const { authorize } = require('../../middleware/rbac')

const router = express.Router();

router.post('/', protect, authorize('ADMIN', 'STAFF'), createOrder);
router.get('/', protect, authorize('ADMIN', 'STAFF'), getOrders);

module.exports = router;