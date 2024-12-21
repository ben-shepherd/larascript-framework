import { EnvironmentDevelopment, EnvironmentType } from '@src/core/consts/Environment';

export type IAppConfig = {
    environment: EnvironmentType
}

/**
 * App configuration
 */
const appConfig: IAppConfig = {

    // Environment
    environment: (process.env.APP_ENV as EnvironmentType) ?? EnvironmentDevelopment,
    
};

export default appConfig;
