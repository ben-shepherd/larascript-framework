import express from 'express';

import IExpressConfig from '@src/core/interfaces/http/IExpressConfig';
import bodyParser from 'body-parser';

const config: IExpressConfig = {
    enabled: true,

    port: parseInt(process.env.APP_PORT ?? '3000'),
    
    globalMiddlewares: [
        express.json(),
        bodyParser.urlencoded({ extended: true }),
    ]
};

export default config