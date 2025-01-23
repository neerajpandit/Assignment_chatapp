import Joi from 'joi';

//Registration validation
const registrationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Name must be a string.',
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name must be at most 50 characters long.',
    'any.required': 'Name is required.',
  }),

  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),

  phone_number: Joi.string().pattern(/^\d{10}$/).required().messages({
    'string.base': 'Phone number must be a string.',
    'string.pattern.base': 'Phone number must be 10 digits long.',
    'any.required': 'Phone number is required.',
  }),

  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  }),

  role: Joi.string().valid('Teacher', 'Student', 'Institute').required().messages({
    'string.base': 'Role must be a string.',
    'any.only': 'Role must be one of "Teacher", "Student", or "Institute".',
    'any.required': 'Role is required.',
  }),

}).with('name', 'email'); // Ensures name and email are required together

export const validateRegistration = (req, res, next) => {
  const { error } = registrationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};


//Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),

  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  })
});

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

//Message validation
const messageSchema = Joi.object({
  sender_id: Joi.number().integer().required().messages({
    'number.base': 'Sender ID must be a number.',
    'any.required': 'Sender ID is required.',
  }),

  receiver_id: Joi.number().integer().required().messages({
    'number.base': 'Receiver ID must be a number.',
    'any.required': 'Receiver ID is required.',
  }),

  content: Joi.string().min(1).required().messages({
    'string.base': 'Message content must be a string.',
    'string.min': 'Message content cannot be empty.',
    'any.required': 'Message content is required.',
  }),

  reply_to: Joi.number().integer().optional().messages({
    'number.base': 'Reply-to message ID must be a number.',
  }),
});

export const validateMessage = (req, res, next) => {
  const { error } = messageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};
