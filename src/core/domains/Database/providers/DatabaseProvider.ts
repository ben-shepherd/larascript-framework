import databaseConfig from "@src/config/database";
import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import DatabaseService from "@src/core/domains/database/services/DatabaseService";

/**
 * DatabaseProvider class
 * 
 * This provider is responsible for setting up the database configuration and
 * booting the database service. It registers the database service in the App
 * container and ensures that the service is booted when the provider is booted.
 * 
 * @extends BaseProvider
 * @see BaseProvider
 */
export default class DatabaseProvider extends BaseProvider {

    /**
     * The database configuration object
     * 
     * @type {IDatabaseConfig}
     */
    protected config: IDatabaseConfig = databaseConfig;

    /**
     * Register method
     * 
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     * 
     * @returns {Promise<void>}
     */
    public async register(): Promise<void> {
        this.log('Registering DatabaseProvider');

        // Register the database service in the App container
        App.setContainer('db', new DatabaseService(this.config))
    }

    /**
     * Boot method
     * 
     * Called after all providers have been registered
     * Use this method to perform any actions that require other services to be available
     * 
     * @returns {Promise<void>}
     */
    public async boot(): Promise<void> {
        this.log('Booting DatabaseProvider');

        // Boot the database service
        await App.container('db').boot();
    }

}

