import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import responseError from '@src/core/domains/express/requests/responseError';
import { Response } from 'express';

/**
 * Gets the currently logged in user
 *
 * @param {IAuthorizedRequest} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export default async (req: IAuthorizedRequest, res: Response) => {
    try {
        // Send the user data without the password
        res.send({ success: true, user: req.user?.getData({ excludeGuarded: true }) });
    }
    catch (error) {
        // If there is an error, send the error response
        if (error instanceof Error) {
            responseError(req, res, error);
            return;
        }
    }
};
