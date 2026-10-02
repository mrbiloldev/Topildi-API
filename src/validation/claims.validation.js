import Joi from "joi";

export const claimCreateSchema = Joi.object({
    answer: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Javob kiritilishi kerak",
            "string.min": "Javob kamida 2 ta belgi bo'lishi kerak",
            "string.max": "Javob 50 ta belgidan oshmasligi kerak",
            "any.required": "Javob kiritilishi kerak"
        }),

    message: Joi.string()
        .trim()
        .max(1000)
        .allow("", null)
        .optional()
});


export const idParamSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "id son bo'lishi kerak",
            "number.integer": "id butun son bo'lishi kerak",
            "number.positive": "id musbat son bo'lishi kerak",
            "any.required": "id majburiy"
        })
});
