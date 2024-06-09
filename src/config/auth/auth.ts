import { AppAuthService } from '../../app/services/AppAuthService';
import { IAuthConfig } from '../../core/interfaces/IAuthConfig';
import parseBooleanFromString from '../../core/util/parseBooleanFromString';

const config: IAuthConfig = {
    authService: AppAuthService,
    authRoutes: parseBooleanFromString(process.env.AUTH_ROUTES, 'true'),
    authCreateAllowed: parseBooleanFromString(process.env.AUTH_ROUTES_ALLOW_CREATE, 'true'),
}

export default config;