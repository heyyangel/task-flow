"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }));
                return next(new ApiError_1.ApiError(400, "Validation failed", errors));
            }
            return next(error);
        }
    };
};
exports.validate = validate;
