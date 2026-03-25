const express = require('express');
const router = express.Router();

const apiKey = require('../middleware/apiKeyMiddleware');
const validate = require('../middleware/validationMiddleware');
const pagination = require('../middleware/paginationMiddleware');
const { createNoteSchema } = require('../validators/noteValidator');
const controller = require('../controllers/noteController');
const settingsController = require('../controllers/settingsController');

router.use(apiKey);

router.post('/', validate(createNoteSchema), controller.create);
router.get('/', pagination, controller.getAll);
// router.get('/:id', controller.getOne);
router.get('/:jobuuid', controller.getOnejobuuid);
router.put('/:id', validate(createNoteSchema), controller.update);
router.delete('/:id', controller.remove);



// GET roles for a specific account
router.get('/roles/:accountUUID', settingsController.getRoleSettings);
// POST/SAVE roles for a specific account
router.post('/roles', settingsController.saveRoleSettings);


module.exports = router;