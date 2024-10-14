import unauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import responseError from '@src/core/domains/express/requests/responseError';
import { App } from '@src/core/services/App';
import { Request, Response } from 'express';

/**
 * Logs in a user
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export default async (req: Request, res: Response): Promise<void> => {
    try {
        // Get the email and password from the request body
        const { email, password } = req?.body ?? {};

        // Attempt to log in the user
        const token = await App.container('auth').attemptCredentials(email, password);

        // Get the user from the database
        const user = await App.container('auth').userRepository.findOneByEmail(email);

        // Send the user data and the token back to the client
        res.send({
            success: true,
            token,
            user: user?.getData({ excludeGuarded: true })
        })
    }
    catch (error) {
        // Handle unauthorized errors
        if (error instanceof unauthorizedError) {
            res.status(401).send({ error: error.message },)
            return;
        }

        // Handle other errors
        if (error instanceof Error) {
            responseError(req, res, error)
            return;
        }
    }
}
