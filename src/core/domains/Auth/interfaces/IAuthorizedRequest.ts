import { Request } from 'express';

import ApiToken from '@app/models/auth/ApiToken';
import User from '@app/models/auth/User';

export default interface IAuthorizedRequest extends Request {
    user?: User | null;
    apiToken?: ApiToken | null;
}