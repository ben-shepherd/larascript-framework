import express from 'express';

import IExpressConfig from '../../core/interfaces/IExpressConfig';
import bodyParser from 'body-parser';

const config: IExpressConfig = {
    port: parseInt(process.env.PORT ?? '3000'),
    
    globalMiddlewares: [
        express.json(),
        bodyParser.urlencoded({ extended: true }),
    ]
};

export default config