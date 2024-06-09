import ApiToken from '../../app/models/ApiToken';
import User from '../../app/models/User';
import AuthService from '../../core/domains/auth/services/AuthService';
import { IAuthConfig } from '../../core/interfaces/IAuthConfig';
import parseBooleanFromString from '../../core/util/parseBooleanFromString';

const config: IAuthConfig = {
    authService: AuthService<User, ApiToken>,
    authRoutes: parseBooleanFromString(process.env.AUTH_ROUTES, 'true'),
    authCreateAllowed: parseBooleanFromString(process.env.AUTH_ROUTES_ALLOW_CREATE, 'true'),
}

export default config;