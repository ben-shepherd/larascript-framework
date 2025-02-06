import { IApiTokenModel } from '../../auth/interfaces/models/IApiTokenModel';
import { IUserModel } from '../../auth/interfaces/models/IUserModel';

export default interface IAuthorizedRequest {
    user?: IUserModel | null;
    apiToken?: IApiTokenModel | null;
}