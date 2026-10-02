export function validate(schema, source = "body") {
    return (req, res, next) => {

        const data = req[source];

        const { error, value } = schema.validate(data, {
            abortEarly: false
        });

        if (error) {
            const errors = error.details.map(item => ({
                field: item.path.join("."),
                message: item.message
            }));

            return res.status(400).json({
                success: false,
                message: "Validatsiya xatosi",
                errors
            });
        }

        req[source] = value;

        next();
    };
}