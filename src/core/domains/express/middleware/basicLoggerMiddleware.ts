import CurrentRequest from '@src/core/domains/express/services/CurrentRequest';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';


export const basicLoggerMiddleware = () => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log('Request', `${req.method} ${req.url}`, 'Headers: ', req.headers, 'CurrentRequest: ', CurrentRequest.get(req));
    next();
};
