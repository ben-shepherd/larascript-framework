import express from 'express';

import IExpressConfig from "../../interfaces/IExpressConfig";

const config: IExpressConfig = {
    port: parseInt(process.env.PORT ?? '3000'),
    
    globalMiddlewares: [
        express.json()
    ]
};

export default config