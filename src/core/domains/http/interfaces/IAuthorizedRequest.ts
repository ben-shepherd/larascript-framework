
import ApiToken from '@src/app/models/auth/ApiToken';
import User from '@src/app/models/auth/User';

export default interface IAuthorizedRequest {
    user?: User | null;
    apiToken?: ApiToken | null;
}