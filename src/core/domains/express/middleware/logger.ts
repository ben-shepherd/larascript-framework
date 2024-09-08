import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';

export const logger = () => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log('Request', `${req.method} ${req.url}`);
    next();
};
