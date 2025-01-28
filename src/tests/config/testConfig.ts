import { IAppConfig } from '@src/config/app';
import { EnvironmentTesting } from '@src/core/consts/Environment';

require('dotenv').config();

const testAppConfig: IAppConfig = {
    env: EnvironmentTesting
};

export default testAppConfig;
