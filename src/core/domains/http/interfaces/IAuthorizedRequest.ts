
import User from '@src/app/models/auth/User';
import ApiToken from '@src/core/domains/auth/models/ApiToken';

export default interface IAuthorizedRequest {
    user?: User | null;
    apiToken?: ApiToken | null;
}