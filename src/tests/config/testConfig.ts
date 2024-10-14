import { EnvironmentTesting } from '@src/core/consts/Environment';
import LoggerProvider from '@src/core/domains/logger/providers/LoggerProvider';
import IAppConfig from '@src/core/interfaces/IAppConfig';

require('dotenv').config();

const testAppConfig: IAppConfig = {
    environment: EnvironmentTesting,

    providers: [
        new LoggerProvider()
    ]
};

export default testAppConfig;
