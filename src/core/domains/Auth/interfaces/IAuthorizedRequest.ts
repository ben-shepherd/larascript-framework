import { Request } from 'express';

import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';

export default interface IAuthorizedRequest extends Request {
    user?: IUserModel | null;
    apiToken?: IApiTokenModel | null;
}