import { EnvironmentDevelopment, EnvironmentType } from '@src/core/consts/Environment';

// App configuration type definition
export type IAppConfig = {
    appKey: string;
    env: EnvironmentType;
}

// App configuration
const appConfig: IAppConfig = {

    // App key
    appKey: process.env.APP_KEY ?? '',

    // Environment
    env: (process.env.APP_ENV as EnvironmentType) ?? EnvironmentDevelopment,
    
};

export default appConfig;
