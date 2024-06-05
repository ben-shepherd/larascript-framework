import express from 'express';

import IExpressConfig from '../../core/interfaces/IExpressConfig';

const config: IExpressConfig = {
    port: parseInt(process.env.PORT ?? '3000'),
    
    globalMiddlewares: [
        express.json()
    ]
};

export default config