import expressConfig from '@config/http/express';
import BaseProvider from "@src/core/base/Provider";
import IExpressConfig from "@src/core/domains/express/interfaces/IExpressConfig";
import { App } from "@src/core/services/App";
import Express from "@src/core/services/Express";

export default class ExpressProvider extends BaseProvider
{
    protected config: IExpressConfig = expressConfig;

    public async register(): Promise<void> 
    {
        if(!this.config.enabled) {
            return;
        }

        this.log('Registering ExpressProvider');

        App.setContainer('express', new Express(this.config));
    }

    public async boot(): Promise<void>
    {
        if(!this.config.enabled) {
            return;
        }
        
        this.log('Booting ExpressProvider');

        const express = App.container('express');
        express.init();
        await express.listen();

        this.log('Express successfully listening on port ' + express.getConfig()?.port);
    }
}