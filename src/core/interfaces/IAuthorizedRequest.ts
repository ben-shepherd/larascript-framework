import { Request } from 'express';

import BaseUserModel from '../domains/Auth/models/BaseUserModel';

export default interface IAuthorizedRequest extends Request {
    user?: BaseUserModel | null;
}