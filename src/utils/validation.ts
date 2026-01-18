import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(30)
    .required(),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(30)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    }),
  role: Joi.string().valid("user", "admin").default("user"),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

export const resendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyForgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

export const resendForgetPasswordOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    }),
});

export const employeeSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(30)
    .required(),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(30)
    .required(),
  email: Joi.string().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,12}$/)
    .required(),
  dob: Joi.date().less("now").required(),
});

export const updateEmployeeSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(30)
    .required(),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(30)
    .required(),
  phone: Joi.string().pattern(/^[0-9]{10,12}$/),
});

export const categorySchemaValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  image: Joi.string().uri().required(),
  description: Joi.string().min(10).max(100).required(),
});

export const productSchemaValidation = Joi.object({
  categoryId: Joi.string().required(),
  userId: Joi.string().required(),
  name: Joi.string().min(3).max(30).required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(50).required(),
  discountPrice: Joi.number().min(50).optional(),
  rating: Joi.number().min(0).max(5).default(0),
  image: Joi.string().uri().required(),
  description: Joi.string().required(),
});

export const updateProductSchemaValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(50).required(),
  discountPrice: Joi.number().min(50).optional(),
  image: Joi.string().uri().required(),
  description: Joi.string().required(),
});

export const orderSchemaValidation = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      description: Joi.string().required(),
    })
  ),
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
      "returned"
    )
    .required(),
  orderDate: Joi.date().required(),
  deliveryDate: Joi.date().required(),
  totalPrice: Joi.number().required(),
});

export const updateOrderSchemaValidation = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      description: Joi.string().required(),
    })
  ),
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
      "returned"
    )
    .required(),
  deliveryDate: Joi.date().required(),
  totalPrice: Joi.number().required(),
});

export const transactionSchemaValidation = Joi.object({
  orderId: Joi.string().required(),
  userId: Joi.string().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  status: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  paymentDate: Joi.date().required(),
});

export const updateTransactionSchemaValidation = Joi.object({
  status: Joi.string().required(),
});

export const reviewSchemaValidation = Joi.object({
  productId: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required(),
  comment: Joi.string().required(),
});

export const updateReviewSchemaValidation = Joi.object({
  rating: Joi.number().min(0).max(5).required(),
  comment: Joi.string().required(),
});
