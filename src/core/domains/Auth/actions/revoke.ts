import { Response } from 'express';

import ApiToken from '@src/app/models/auth/ApiToken';
import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import responseError from '@src/core/domains/express/requests/responseError';
import { App } from '@src/core/services/App';

export default async (req: IAuthorizedRequest, res: Response) => {
    try {
        const auth = App.container('auth');

        await auth.revokeToken(req.apiToken as ApiToken);

        res.send({ success: true })
    }
    catch (error) {
        if(error instanceof Error) {
            responseError(req, res, error)   
        }
    }
}