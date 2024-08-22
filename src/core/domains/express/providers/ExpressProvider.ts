import httpConfig from '@src/config/http';
import BaseProvider from "@src/core/base/Provider";
import IExpressConfig from "@src/core/domains/express/interfaces/IExpressConfig";
import Express from '@src/core/domains/express/services/Express';
import { App } from "@src/core/services/App";

export default class ExpressProvider extends BaseProvider
{
    protected config: IExpressConfig = httpConfig;

    public async register(): Promise<void> 
    {
        this.log('Registering ExpressProvider');

        App.setContainer('express', new Express(this.config));
    }

    public async boot(): Promise<void>
    {
        this.log('Booting ExpressProvider');
        
        if(!this.config.enabled) {
            this.log('Express is not enabled');
            return;
        }

        const express = App.container('express');
        express.init();
        await express.listen();

        this.log('Express successfully listening on port ' + express.getConfig()?.port);
    }
}