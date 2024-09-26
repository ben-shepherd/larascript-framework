import IExpressConfig from '@src/core/domains/express/interfaces/IExpressConfig';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';
import bodyParser from 'body-parser';
import express from 'express';

const config: IExpressConfig = {

    /**
     * Enable Express
     */
    enabled: parseBooleanFromString(process.env.ENABLE_EXPRESS, 'true'),

    /**
     * HTTP port
     */
    port: parseInt(process.env.APP_PORT ?? '5000'),
    
    /**
     * Global middlewares
     */
    globalMiddlewares: [
        express.json(),
        bodyParser.urlencoded({ extended: true }),
    ]
};

export default config