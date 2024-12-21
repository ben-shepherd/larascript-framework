import { EnvironmentDevelopment, EnvironmentType } from '@src/core/consts/Environment';

// App configuration type definition
export type IAppConfig = {
    env: EnvironmentType
}

// App configuration
const appConfig: IAppConfig = {

    // Environment
    env: (process.env.APP_ENV as EnvironmentType) ?? EnvironmentDevelopment,
    
};

export default appConfig;
