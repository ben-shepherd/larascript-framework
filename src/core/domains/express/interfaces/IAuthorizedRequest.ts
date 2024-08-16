
import ApiToken from '@app/models/auth/ApiToken';
import User from '@app/models/auth/User';

export default interface IAuthorizedRequest {
    user?: User | null;
    apiToken?: ApiToken | null;
}