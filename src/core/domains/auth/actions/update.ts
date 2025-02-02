import User, { UserAttributes } from '@src/app/models/auth/User';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';
import responseError from '@src/core/domains/http/handlers/responseError';
import { BaseRequest } from '@src/core/domains/http/interfaces/BaseRequest.t';
import { Response } from 'express';

/**
 * Updates the currently logged in user
 * 
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response) => {
    try {
        const user = req.user as User;
        const { password, firstName, lastName } = req.body as Pick<UserAttributes, 'password' | 'firstName' | 'lastName'>;

        // If the user provided a new password, hash it and update the user object
        if(password) {
            await user.setAttribute('hashedPassword', hashPassword(password));
        }

        // Update the user object with the new first and last name
        await user.fill({
            firstName,
            lastName
        });

        // Save the changes to the database
        await user.save();

        // Return the updated user data
        res.send({ success: true, user: await req.user?.getData({ excludeGuarded: true }) })
    }
    catch (error) {
        // If there is an error, send the error response
        if(error instanceof Error) {
            responseError(req, res, error)   
            return;
        }
    }
}
