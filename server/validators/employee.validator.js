const Joi = require("joi");

const possiblePositions = [
  "CHEF",
  "LINE COOK",
  "SOUS CHEF",
  "BARTENDER",
  "SERVER",
  "HOST/HOSTESS",
  "BUSSER",
  "DISHWASHER",
  "CASHIER",
];

// validate mongodb id
const validateId = Joi.object({
  employeeId: Joi.string().hex().length(24).required(),
});

const registerSchema = Joi.object({
  firstName: Joi.string().trim().uppercase().required(),
  lastName: Joi.string().trim().uppercase().required(),
  email: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
    .required()
    .options({
      messages: {
        "string.pattern.base": "email is not valid",
      },
    }),
  password: Joi.string().required(),
  position: Joi.string()
    .trim()
    .uppercase()
    .valid(...possiblePositions)
    .required(),
  contactNumber: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
    .required()
    .options({
      messages: {
        "string.pattern.base": "email is not valid",
      },
    }),
  password: Joi.string().required(),
});

const updateProfileSchemaForEmployee = Joi.object({
  contactNumber: Joi.string().trim(),
  address: Joi.string().trim(),
  password: Joi.string()
    .when("confirmPassword", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .valid(Joi.ref("confirmPassword"))
    .messages({
      "any.only": "password and confirmPassword must be the same",
    }),
  confirmPassword: Joi.string(),
  oldPassword: Joi.string()
    .when("password", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .invalid(Joi.ref("password"))
    .label("password")
    .messages({
      "any.invalid": "password and oldPassword must not be same",
    }),
})
  .with("oldPassword", "password")
  .label("password")
  .messages({
    "object.with": "from with password is required",
  });

const updateProfileSchemaForManager = Joi.object({
  firstName: Joi.string().trim().uppercase(),
  lastName: Joi.string().trim().uppercase(),
  email: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
    .options({
      messages: {
        "string.pattern.base": "email is not valid",
      },
    }),
  position: Joi.string()
    .trim()
    .uppercase()
    .valid(...possiblePositions),
  contactNumber: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
});

module.exports = {
  possiblePositions,
  validateId,
  registerSchema,
  loginSchema,
  updateProfileSchemaForEmployee,
  updateProfileSchemaForManager,
};
