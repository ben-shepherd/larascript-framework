import { Request, Response } from 'express';
import ValidationError from '../../../../exceptions/ValidationError';
import UserRepository from '../../repository/UserRepository';
import userFactory from '../../factory/userFactory';
import Auth from '../../../../services/Auth';


export default async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    try {
        if (!email || email?.length === 0 || !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            throw new ValidationError('Invalid email address');
        }
        if(!password || password?.length <= 5) {
            throw new ValidationError('Password must be at least 6 characters long');
        }

        const repository = new UserRepository();
        const existingUser = await repository.findByEmail(email);

        if(existingUser) {
            throw new ValidationError('User already exists');
        }

        const user = userFactory(email, password);
        await user.save();
        
        const token = await Auth.getInstance().createToken(user);

        res.send({ success: true, token })
    }
    catch (error) {
        if(error instanceof ValidationError) {
            res.status(400).send({ error: error.message })
            return;
        }
        
        res.status(500).send({ error: 'Internal server error' })
    }

}