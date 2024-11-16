

import { IDatabaseAdapterConfig, IDatabaseGenericConnectionConfig } from "../interfaces/IDatabaseConfig";

class DatabaseConfig {

    public static createConfig(options: IDatabaseGenericConnectionConfig): IDatabaseGenericConnectionConfig {
        return options
    }

    public static createAdapter(config: IDatabaseAdapterConfig): IDatabaseAdapterConfig {
        return config
    }
    
}

export default DatabaseConfig