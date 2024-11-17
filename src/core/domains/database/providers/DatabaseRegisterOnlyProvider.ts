import databaseConfig from "@src/config/database";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import DatabaseProvider from "@src/core/domains/database/providers/DatabaseProvider";

/**
 * DatabaseRegisterOnlyProvider class
 * 
 * This provider is a subclass of DatabaseProvider that only registers the database service in the App container.
 */
export default class DatabaseRegisterOnlyProvider extends DatabaseProvider {

    /**
     * The database configuration object
     * 
     * @type {IDatabaseConfig}
     */
    protected config: IDatabaseConfig = {
        onBootConnect: false,
        ...databaseConfig
    };

}

