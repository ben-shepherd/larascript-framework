import { IRoutesConfig } from "../../interfaces/IRoutesConfig";


const parseBooleanFromString = (value: string | undefined, defaultValue: 'true' | 'false'): boolean => (value ?? defaultValue) === 'true';

const config: IRoutesConfig = {
    authRoutes: parseBooleanFromString(process.env.APP_AUTH_ROUTES, 'true'),
    authCreateAllowed: parseBooleanFromString(process.env.APP_AUTH_ROUTES, 'true'),
}

export default config;