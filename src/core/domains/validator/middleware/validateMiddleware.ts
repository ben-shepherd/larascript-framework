import { NextFunction, Response } from 'express';

import responseError from '@src/core/domains/express/requests/responseError';
import responseValidationError from '@src/core/domains/express/requests/responseValidationError';
import ValidationError from '@src/core/exceptions/ValidationError';
import { BaseRequest } from '../../express/types/BaseRequest.t';
import { ValidatorMiddlewareProps } from '../interfaces/IValidatorService';

export const validateMiddleware = ({validator, validateBeforeAction}: ValidatorMiddlewareProps) => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        req.validator = validator;

        if(validateBeforeAction) {
            const result = validator.validate(req.body);

            if(!result.success) {
                throw new ValidationError(result.joi.error?.message ?? 'Validation failed');
            }
        }
        
        next();
    }
    catch (error) {
        if(error instanceof ValidationError) {
            responseValidationError(req, res, error, 422)
            return;
        }

        if(error instanceof Error) {
            responseError(req, res, error)
        }
    }
};