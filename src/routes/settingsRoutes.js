const express = require('express');
const router = express.Router();
const apiKey = require('../middleware/apiKeyMiddleware');
const settingsController = require('../controllers/settingsController');

router.use(apiKey);

// GET roles for a specific account
router.get('/roles/:accountUUID', settingsController.getRoleSettings);
// POST/SAVE roles for a specific account
router.post('/roles', settingsController.saveRoleSettings);


module.exports = router;