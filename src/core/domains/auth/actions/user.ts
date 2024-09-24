import IAuthorizedRequest from '@src/core/domains/auth/interfaces/IAuthorizedRequest';
import responseError from '@src/core/domains/express/requests/responseError';
import { Response } from 'express';

/**
 * Returns the currently logged in user
 *
 * @param {IAuthorizedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export default (req: IAuthorizedRequest, res: Response) => {
    try {
        // Send the user data without the password
        res.send({ success: true, user: req.user?.getData({ excludeGuarded: true }) });
    }
    catch (error) {
        // Handle any errors
        if (error instanceof Error) {
            responseError(req, res, error);
            return;
        }
    }
};
