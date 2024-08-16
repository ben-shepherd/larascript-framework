import { NextFunction, Response } from 'express';

import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import ValidationError from '@src/core/exceptions/ValidationError';
import responseError from '@src/core/http/requests/responseError';
import responseValidationError from '@src/core/http/requests/responseValidationError';
import IValidator from '../interfaces/IValidator';

export const validateMiddleware = (validator: IValidator) => async (req: IAuthorizedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = validator.validate(req.body);

        if(!result.success) {
            throw new ValidationError(result.joi.error?.message ?? 'Validation failed');
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