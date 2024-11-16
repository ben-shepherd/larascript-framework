


import { IDatabaseConfig, IDatabaseGenericConnectionConfig } from "../interfaces/IDatabaseConfig";

class DatabaseConfig {

    public static createConnections(connectionsConfigArray: IDatabaseGenericConnectionConfig[]): IDatabaseConfig['connections'] {
        return connectionsConfigArray;
    }

    public static createConfig(config: IDatabaseGenericConnectionConfig): IDatabaseGenericConnectionConfig {
        return config
    }
    
}

export default DatabaseConfig