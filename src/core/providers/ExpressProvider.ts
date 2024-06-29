import expressConfig from '@config/http/express';
import BaseProvider from "../base/Provider";
import IExpressConfig from "../interfaces/http/IExpressConfig";
import { App } from "../services/App";
import Express from "../services/Express";

export default class ExpressProvider extends BaseProvider
{
    protected config: IExpressConfig = expressConfig;

    public async register(): Promise<void> 
    {
        this.log('Registering ExpressProvider');

        App.setContainer('express', new Express(this.config));
    }

    public async boot(): Promise<void>
    {
        this.log('Booting ExpressProvider');

        const express = App.container('express');
        express.init();
        await express.listen();

        this.log('Express successfully listening on port ' + express.getConfig()?.port);
    }
}