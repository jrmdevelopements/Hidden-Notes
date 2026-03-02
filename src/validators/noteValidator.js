const Joi = require('joi');

exports.createNoteSchema = Joi.object({
  jobuuid: Joi.string().required(),
  notes: Joi.string().required()
});