import httpConfig from '@src/config/http';
import BaseProvider from "@src/core/base/Provider";
import IExpressConfig from "@src/core/domains/express/interfaces/IExpressConfig";
import { App } from "@src/core/services/App";
import ExpressService from '@src/core/domains/express/services/ExpressService';

export default class ExpressProvider extends BaseProvider {

    /**
     * The configuration for the Express provider
     *
     * @default httpConfig
     */
    protected config: IExpressConfig = httpConfig;

    /**
     * Register method
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     *
     * @returns Promise<void>
     */
    public async register(): Promise<void> {
        this.log('Registering ExpressProvider');


        // Register the Express service in the container
        // This will be available in any provider or service as App.container('express')
        App.setContainer('express', new ExpressService(this.config));
    }

    /**
     * Boot the Express provider
     *
     * @returns Promise<void>
     */
    public async boot(): Promise<void> {

        /**
         * If Express is not enabled, return from the boot method
         */
        if (!this.config.enabled) {
            this.log('Express is not enabled');
            return;
        }

        this.log('Booting ExpressProvider');

        /**
         * Get the Express instance from the container
         * Initialize Express
         */
        const express = App.container('express');
        express.init();

        /**
         * Start listening for connections
         */
        await express.listen();

        this.log('Express successfully listening on port ' + express.getConfig()?.port);
    }

}