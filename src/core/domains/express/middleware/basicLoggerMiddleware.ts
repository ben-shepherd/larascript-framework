import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';


export const basicLoggerMiddleware = () => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log('New request: ', `${req.method} ${req.url}`, 'Headers: ', req.headers);
    next();
};
