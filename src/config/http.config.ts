import IHttpConfig from '@src/core/domains/http/interfaces/IHttpConfig';
import BasicLoggerMiddleware from '@src/core/domains/http/middleware/BasicLoggerMiddleware';
import SecurityMiddleware from '@src/core/domains/http/middleware/SecurityMiddleware';
import ValidatorMiddleware from '@src/core/domains/validator/middleware/ValidatorMiddleware';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';
import express from 'express';

const config: IHttpConfig = {

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

        /**
         * Larascript required middlewares
         */
        express.json(),
        BasicLoggerMiddleware,
        SecurityMiddleware,
        ValidatorMiddleware,

        /**
         * Add your custom middlewares below
         */
    ],

    csrf: {
        exclude: [
            '/auth/*',
        ]
    },

    /**
     * Logging
     */
    logging: {
        requests: parseBooleanFromString(process.env.ENABLE_REQUEST_LOGGING, 'true'),
        boundRouteDetails: parseBooleanFromString(process.env.ENABLE_BOUND_ROUTE_DETAILS, 'true')
    }

};

export default config