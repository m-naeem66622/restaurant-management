const Joi = require("joi");

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

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().uppercase(),
  lastName: Joi.string().trim().uppercase(),
  email: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
    .options({
      messages: {
        "string.pattern.base": "email is not valid",
      },
    }),
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
    "object.with": "password is required",
  });

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
