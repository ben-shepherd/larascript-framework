import ApiTokenRepository from '../../app/repositories/ApiTokenRepository';
import UserRepository from '../../app/repositories/UserRepository';
import { IAuthConfig } from '../../core/interfaces/IAuthConfig';
import parseBooleanFromString from '../../core/util/parseBooleanFromString';

const config: IAuthConfig = {
    userRepository: UserRepository,
    apiTokenRepository: ApiTokenRepository,
    authRoutes: parseBooleanFromString(process.env.AUTH_ROUTES, 'true'),
    authCreateAllowed: parseBooleanFromString(process.env.AUTH_ROUTES_ALLOW_CREATE, 'true'),
}

export default config;