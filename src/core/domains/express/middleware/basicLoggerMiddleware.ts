import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { App } from '@src/core/services/App';
import { NextFunction, Response } from 'express';


export const basicLoggerMiddleware = () => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    App.container('logger').info('New request: ', `${req.method} ${req.url}`, 'Headers: ', req.headers);
    next();
};
