import { Response } from 'express';

import ResponseError from '../../../http/requests/ResponseError';
import IAuthorizedRequest from '../../../interfaces/IAuthorizedRequest';

export default (req: IAuthorizedRequest, res: Response) => {
    try {
        res.send({ success: true, user: req.user?.getData({ excludeGuarded: true }) })
    }
    catch (error) {
        if(error instanceof Error) {
            ResponseError(req, res, error)   
        }
    }
}