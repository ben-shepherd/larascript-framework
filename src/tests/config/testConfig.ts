import { EnvironmentTesting } from '@src/core/consts/Environment';
import IAppConfig from '@src/core/interfaces/IAppConfig';

require('dotenv').config();

const testAppConfig: IAppConfig = {
    environment: EnvironmentTesting,

    providers: [],

    commands: []
};

export default testAppConfig;
