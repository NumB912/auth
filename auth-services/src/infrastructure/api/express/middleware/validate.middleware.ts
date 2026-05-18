import { ValidationError } from "@domain/errors/AppError.js";
import type { Ivalidate } from "@domain/validate/validate.entities.js";
import type ZodValidate from "@infrastructure/service/validate/zod/zod.validate.js";
import type { NextFunction, Request, Response } from "express";

function validate<T>(validateFunc: Ivalidate<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { data, isSuccess, errors } = validateFunc.validate(req.body);
        
        if (!isSuccess) {
            return next(new ValidationError(errors as string[]))
        }

        req.body = data;
        next();
    };
}

export default validate