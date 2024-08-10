import Roles from '@src/core/domains/Auth/enums/RolesEnum';
import UserFactory from '@src/core/domains/Auth/factory/userFactory';
import hashPassword from '@src/core/domains/Auth/utils/hashPassword';
import responseError from "@src/core/http/requests/ResponseError";
import { App } from '@src/core/services/App';
import { Request, Response } from 'express';
import ValidationError from '../../../exceptions/ValidationError';

export default async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    try {
        if (!email || email?.length === 0 || !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            throw new ValidationError('Invalid email address');
        }
        if(!password || password?.length <= 5) {
            throw new ValidationError('Password must be at least 6 characters long');
        }

        const repository = App.container('auth').userRepository;
        const existingUser = await repository.findOneByEmail(email);

        if(existingUser) {
            throw new ValidationError('User already exists');
        }

        const user = new UserFactory().create({
            email,
            hashedPassword: hashPassword(password),
            roles: [Roles.USER]
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