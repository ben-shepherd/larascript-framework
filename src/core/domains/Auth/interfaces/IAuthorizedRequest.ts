import { Request } from 'express';

import IApiTokenModel from './IApitokenModel';
import IUserModel from './IUserModel';

export default interface IAuthorizedRequest extends Request {
    user?: IUserModel | null;
    apiToken?: IApiTokenModel | null;
}