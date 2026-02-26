const express = require('express');
const router = express.Router();

const apiKey = require('../middleware/apiKeyMiddleware');
const validate = require('../middleware/validationMiddleware');
const pagination = require('../middleware/paginationMiddleware');
const { createNoteSchema } = require('../validators/noteValidator');
const controller = require('../controllers/noteController');

// Protect ALL routes using API key
// router.use(apiKey);

router.post('/', validate(createNoteSchema), controller.create);
router.get('/', pagination, controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', validate(createNoteSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;