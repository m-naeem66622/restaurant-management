const Joi = require("joi");

const validateId = Joi.object({
  scheduleId: Joi.string().hex().length(24).required(),
});

const createSchema = Joi.object({
  employee: Joi.string().hex().length(24).required(),
  weekStartDate: Joi.date().required(),
  weekEndDate: Joi.date().min(Joi.ref("weekStartDate")).required(),
  monHrs: Joi.number().min(0).max(24),
  tuesHrs: Joi.number().min(0).max(24),
  wedHrs: Joi.number().min(0).max(24),
  thursHrs: Joi.number().min(0).max(24),
  friHrs: Joi.number().min(0).max(24),
  satHrs: Joi.number().min(0).max(24),
  sunHrs: Joi.number().min(0).max(24),
});

const getAllSchema = Joi.object({
  limit: Joi.number().min(1).default(10),
  page: Joi.number().min(1).default(1),
});

const updateSchema = Joi.object({
  weekStartDate: Joi.date(),
  weekEndDate: Joi.date().min(Joi.ref("weekStartDate")),
  monHrs: Joi.number().min(0).max(24),
  tuesHrs: Joi.number().min(0).max(24),
  wedHrs: Joi.number().min(0).max(24),
  thursHrs: Joi.number().min(0).max(24),
  friHrs: Joi.number().min(0).max(24),
  satHrs: Joi.number().min(0).max(24),
  sunHrs: Joi.number().min(0).max(24),
});

module.exports = {
  validateId,
  createSchema,
  getAllSchema,
  updateSchema,
};
