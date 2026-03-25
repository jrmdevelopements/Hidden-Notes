const express = require('express');
const router = express.Router();

const apiKey = require('../middleware/apiKeyMiddleware');
const validate = require('../middleware/validationMiddleware');
const pagination = require('../middleware/paginationMiddleware');
const { createNoteSchema } = require('../validators/noteValidator');
const controller = require('../controllers/hiddenNotesController');

router.use(apiKey);

router.post('/', validate(createNoteSchema), controller.create);
router.get('/', pagination, controller.getAll);
router.get('/:jobuuid', controller.getOneByJobuuid);
router.put('/:id', validate(createNoteSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;