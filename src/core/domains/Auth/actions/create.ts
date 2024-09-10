import Roles from '@src/core/domains/auth/enums/RolesEnum';
import UserFactory from '@src/core/domains/auth/factory/userFactory';
import { IUserData } from '@src/core/domains/auth/interfaces/IUserModel';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';
import responseError from '@src/core/domains/express/requests/responseError';
import ValidationError from '@src/core/exceptions/ValidationError';
import { App } from '@src/core/services/App';
import { Request, Response } from 'express';

/**
 * Creates a new user
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export default async (req: Request, res: Response): Promise<void> => {

    const { email, password, firstName, lastName } = req.body as Pick<IUserData, 'email' | 'password' | 'firstName' | 'lastName'>;

    try {
        // Check if the user already exists
        const repository = App.container('auth').userRepository;
        const existingUser = await repository.findOneByEmail(email);

        if (existingUser) {
            // If the user already exists, throw a validation error
            throw new ValidationError('User already exists');
        }

        // Create a new user
        const user = new UserFactory().create({
            email,
            password,
            hashedPassword: hashPassword(password ?? ''),
            roles: [Roles.USER],
            firstName,
            lastName
        });

        // Save the user to the database
        await user.save();

        // Generate a JWT token for the user
        const token = await App.container('auth').createJwtFromUser(user);

        // Return the user data and the JWT token
        res.send({ 
            success: true,
            token,
            user: user.getData({ excludeGuarded: true })
        });
    }
    catch (error) {
        // Handle validation errors
        if (error instanceof ValidationError) {
            res.status(400).send({ error: error.message });
            return;
        }

        // Handle other errors
        if (error instanceof Error) {
            responseError(req, res, error);
        }
    }

}
