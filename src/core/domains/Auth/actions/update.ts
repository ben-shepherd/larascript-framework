import { Response } from 'express';
import User from '@src/app/models/auth/User';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { IUserData } from '@src/core/domains/auth/interfaces/IUserModel';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';

export default async (req: BaseRequest, res: Response) => {
    try {
        const user = req.user as User;
        const { password, firstName, lastName } = req.body as Pick<IUserData, 'password' | 'firstName' | 'lastName'>;

        if(password) {
            user.setAttribute('hashedPassword', hashPassword(password));
        }

        user.fill({
            firstName,
            lastName
        })
        await user.save();

        res.send({ success: true, user: req.user?.getData({ excludeGuarded: true }) })
    }
    catch (error) {
        if(error instanceof Error) {
            responseError(req, res, error)   
        }
    }
}