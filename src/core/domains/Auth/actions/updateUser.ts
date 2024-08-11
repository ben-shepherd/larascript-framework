import { Response } from 'express';

import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import responseError from '@src/core/http/requests/responseError';

export default (req: IAuthorizedRequest, res: Response) => {
    try {
        res.send({ success: true, user: req.user?.getData({ excludeGuarded: true }) })
    }
    catch (error) {
        if(error instanceof Error) {
            responseError(req, res, error)   
        }
    }
}