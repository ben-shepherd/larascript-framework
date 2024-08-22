import express from 'express';

import IExpressConfig from '@src/core/domains/express/interfaces/IExpressConfig';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';
import bodyParser from 'body-parser';

const config: IExpressConfig = {
    enabled: parseBooleanFromString(process.env.ENABLE_EXPRESS, 'true'),

    port: parseInt(process.env.APP_PORT ?? '5000'),
    
    globalMiddlewares: [
        express.json(),
        bodyParser.urlencoded({ extended: true }),
    ]
};

export default config