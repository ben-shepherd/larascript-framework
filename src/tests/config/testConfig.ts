import IAppConfig from '@src/core/interfaces/IAppConfig';

require('dotenv').config();

const testAppConfig: IAppConfig = {
    environment: 'testing',

    providers: [],

    commands: []
};

export default testAppConfig;
