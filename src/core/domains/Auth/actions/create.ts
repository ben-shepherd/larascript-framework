import Roles from '@src/core/domains/auth/enums/RolesEnum';
import UserFactory from '@src/core/domains/auth/factory/UserFactory';
import { IUserData } from '@src/core/domains/auth/interfaces/IUserModel';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';
import responseError from '@src/core/domains/express/requests/responseError';
import ValidationError from '@src/core/exceptions/ValidationError';
import { App } from '@src/core/services/App';
import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {

    const { email, password, firstName, lastName } = req.body as Pick<IUserData, 'email' | 'password' | 'firstName' | 'lastName'>;

    try {
        const repository = App.container('auth').userRepository;
        const existingUser = await repository.findOneByEmail(email);

        if(existingUser) {
            throw new ValidationError('User already exists');
        }

        const user = new UserFactory().create({
            email,
            password,
            hashedPassword: hashPassword(password ?? ''),
            roles: [Roles.USER],
            firstName,
            lastName
        });
        
        await user.save();
        
        const token = await App.container('auth').createJwtFromUser(user);
        
        res.send({ 
            success: true,
            token,
            user: user.getData({ excludeGuarded: true })
        })
    }
    catch (error) {
        if(error instanceof ValidationError) {
            res.status(400).send({ error: error.message })
            return;
        }

        if(error instanceof Error) {
            responseError(req, res, error)
        }
    }

}