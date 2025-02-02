import IExpressConfig from '@src/core/domains/http/interfaces/IHttpConfig';
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
    ],

    /**
     * Logging
     */
    logging: {
        requests: false,
        boundRouteDetails: false
    }

};

export default config