import { Request } from 'express';
import UserModel from '../domains/Auth/models/UserModel';


export default interface IAuthorizedRequest extends Request {
    user?: UserModel | null;
}