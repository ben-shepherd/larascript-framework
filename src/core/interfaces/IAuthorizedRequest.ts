import { Request } from 'express';

import BaseUserModel from '../domains/Auth/models/BaseUserModel';

export default interface IAuthorizedRequest<TUser extends BaseUserModel = BaseUserModel> extends Request {
    user?: TUser | null;
}