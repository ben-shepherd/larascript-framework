
import User from '@src//models/auth/User';
import ApiToken from '@src/app/models/auth/ApiToken';

export default interface IAuthorizedRequest {
    user?: User | null;
    apiToken?: ApiToken | null;
}