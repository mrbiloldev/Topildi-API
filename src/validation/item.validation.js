import Joi from "joi";

export const createItemSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(5)
        .max(100)
        .required(),

    description: Joi.string()
        .trim()
        .min(10)
        .max(1000)
        .required(),

    location: Joi.string()
        .trim()
        .min(3)
        .max(150)
        .required(),

    category_id: Joi.number()
        .integer()
        .positive()
        .required(),

    type: Joi.string()
        .valid("lost", "found")
        .required(),

    event_date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            "string.pattern.base":
                "event_date YYYY-MM-DD formatida bo'lishi kerak"
        }),

    secret_question: Joi.when("type", {
        is: "found",
        then: Joi.string()
            .trim()
            .min(10)
            .max(200)
            .required(),

        otherwise: Joi.forbidden()
    }),

    secret_answer: Joi.when("type", {
        is: "found",
        then: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required(),

        otherwise: Joi.forbidden()
    })
});

export const updateItemSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(5)
        .max(100),

    description: Joi.string()
        .trim()
        .min(10)
        .max(1000),

    location: Joi.string()
        .trim()
        .min(3)
        .max(150),

    category_id: Joi.number()
        .integer()
        .positive(),

    status: Joi.string()
        .valid("closed")
}).min(1);

export const getItemsQuerySchema = Joi.object({
    type: Joi.string()
        .valid("lost", "found"),

    category_id: Joi.number()
        .integer()
        .positive(),

    search: Joi.string()
        .trim()
        .allow(""),

    page: Joi.number()
        .integer()
        .positive()
        .default(1),

    limit: Joi.number()
        .integer()
        .positive()
        .max(50)
        .default(10)
});

export const reportItemSchema = Joi.object({
    message: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .optional()
});