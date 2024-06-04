import { IRoutesConfig } from '../../interfaces/IRoutesConfig';
import parseBooleanFromString from '../../util/parseBooleanFromString';

const config: IRoutesConfig = {
    authRoutes: parseBooleanFromString(process.env.AUTH_ROUTES, 'true'),
    authCreateAllowed: parseBooleanFromString(process.env.AUTH_ROUTES_ALLOW_CREATE, 'true'),
}

export default config;