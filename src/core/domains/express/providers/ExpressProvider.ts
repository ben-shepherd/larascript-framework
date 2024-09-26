import httpConfig from '@src/config/http';
import BaseProvider from "@src/core/base/Provider";
import IExpressConfig from "@src/core/domains/express/interfaces/IExpressConfig";
import ExpressService from '@src/core/domains/express/services/ExpressService';
import RequestContext from '@src/core/domains/express/services/RequestContext';
import RequestContextCleaner from '@src/core/domains/express/services/RequestContextCleaner';
import { App } from "@src/core/services/App";


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

        // Register the RequestContext service in the container
        // This will be available in any provider or service as App.container('requestContext')
        // The RequestContext class can be used to store data over a request's life cycle
        // Additionally, data can be stored which can be linked to the requests IP Address with a TTL
        App.setContainer('requestContext', new RequestContext());
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

        /**
         * Start the RequestContextCleaner
         */
        RequestContextCleaner.boot({
            delayInSeconds: this.config.currentRequestCleanupDelay ?? 30
        })

        // Log that Express is successfully listening
        this.log('Express successfully listening on port ' + express.getConfig()?.port);
    }

}