
import { Request } from 'express';

import { IApiTokenModel } from '../../auth/interfaces/models/IApiTokenModel';
import { IUserModel } from '../../auth/interfaces/models/IUserModel';

export default interface IAuthorizedRequest extends Request {
    user?: IUserModel | null;
    apiToken?: IApiTokenModel | null;
}