import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { ValidatorMiddlewareProps } from '@src/core/domains/validator/interfaces/IValidatorService';
import { NextFunction, Response } from 'express';

/**
 * A middleware that validates the request body using the provided validator.
 * If validateBeforeAction is true, it will validate the request body before
 * calling the next middleware. If the validation fails, it will send a 400
 * response with the validation errors. If the validation succeeds, it will
 * call the next middleware.
 *
 * @param {{validator: IValidator, validateBeforeAction: boolean}} options
 * @returns {import('express').RequestHandler} The middleware function
 */
export const validateMiddleware = ({validator, validateBeforeAction}: ValidatorMiddlewareProps) => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        req.validator = validator;

        if(validateBeforeAction) {
            const result = await validator.validate(
                req.body,
                { 
                    stripUnknown: true,
                    ...validator.getJoiOptions() 
                }
            );

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
            return;
        }
    }
};