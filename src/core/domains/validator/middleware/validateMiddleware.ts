import { NextFunction, Response } from 'express';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { ValidatorMiddlewareProps } from '@src/core/domains/validator/interfaces/IValidatorService';

export const validateMiddleware = ({validator, validateBeforeAction}: ValidatorMiddlewareProps) => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        req.validator = validator;

        if(validateBeforeAction) {
            const result = await validator.validate(req.body);

            if(!result.success) {
                res.send({
                    success: false,
                    errors: (result.joi.error?.details ?? []).map((detail) => detail)
                })
                return;
            }
        }

        next();
    }
    catch (error) {
        if(error instanceof Error) {
            responseError(req, res, error)
        }
    }
};