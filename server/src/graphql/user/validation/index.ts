import Joi from "joi";

export const emailSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  // Add more validation rules if needed
});
