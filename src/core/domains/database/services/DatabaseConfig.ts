


import { IDatabaseConfig, IDatabaseGenericConnectionConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";

class DatabaseConfig {

    /**
     * Creates a connections array for the database config.
     * @param connectionsConfigArray The array of connection configurations
     * @returns The connections array
     */
    public static createConnections(connectionsConfigArray: IDatabaseGenericConnectionConfig[]): IDatabaseConfig['connections'] {
        return connectionsConfigArray;
    }

    /**
     * Creates a database configuration object from a connection configuration object.
     * 
     * This method simply returns the given connection configuration object as is, without performing any changes.
     * 
     * @param config - The connection configuration object implementing IDatabaseGenericConnectionConfig interface.
     * @returns The given connection configuration object as an IDatabaseGenericConnectionConfig.
     */
    public static createConfig(config: IDatabaseGenericConnectionConfig): IDatabaseGenericConnectionConfig {
        return config
    }
    
}

export default DatabaseConfig