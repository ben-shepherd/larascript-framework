import IExpressConfig from '@src/core/domains/http/interfaces/IHttpConfig';
import ValidatorMiddleware from '@src/core/domains/validator/middleware/ValidatorMiddleware';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';
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
        ValidatorMiddleware
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