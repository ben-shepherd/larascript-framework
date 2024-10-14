import ApiToken from '@src/app/models/auth/ApiToken';
import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import responseError from '@src/core/domains/express/requests/responseError';
import { App } from '@src/core/services/App';
import { Response } from 'express';

/**
 * Revokes the API token associated with the request
 *
 * @param {IAuthorizedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export default async (req: IAuthorizedRequest, res: Response) => {
    try {
        // Get the auth service
        const auth = App.container('auth');

        // Revoke the API token
        await auth.revokeToken(req.apiToken as ApiToken);

        // Send a success response
        res.send({ success: true });
    }
    catch (error) {
        // Handle any errors
        if (error instanceof Error) {
            responseError(req, res, error);
            return;
        }
    }
};
