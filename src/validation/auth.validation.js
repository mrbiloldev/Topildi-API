import Joi from "joi";

export const registerSchema = Joi.object({
    full_name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    phone: Joi.string()
        .pattern(/^\+998\d{9}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Telefon +998XXXXXXXXX formatida bo'lishi kerak"
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
        .required()
        .messages({
            "string.min":
                "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
            "string.pattern.base":
                "Parolda kamida 1 ta harf va 1 ta raqam bo'lishi kerak"
        })
});


export const verifySchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    code: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Kod aynan 6 ta raqam bo'lishi kerak"
        })
});


export const resendCodeSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required()
});


export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .required()
});


export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required()
});


export const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    code: Joi.string()
        .pattern(/^\d{6}$/)
        .required(),

    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
        .required()
});