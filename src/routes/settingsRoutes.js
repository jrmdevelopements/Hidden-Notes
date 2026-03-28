const express = require('express');
const router = express.Router();
const apiKey = require('../middleware/apiKeyMiddleware');
const settingsController = require('../controllers/settingsController');

router.use(apiKey);

router.get('/roles/:accountUUID', settingsController.getRoleSettings);
router.post('/roles', settingsController.saveRoleSettings);
router.put('/roles', settingsController.updateRoleSettings);

module.exports = router;