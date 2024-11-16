

import { ICtor } from "@src/core/interfaces/ICtor";

import { IDatabaseAdapter } from "../interfaces/IDatabaseAdapter";
import { IDatabaseConfig, IDatabaseGenericConnectionConfig } from "../interfaces/IDatabaseConfig";
import DatabaseAdapter from "./DatabaseAdapter";

export type TCreateConnectionConfigArray = {
    name: string;
    config: IDatabaseGenericConnectionConfig
}[];

class DatabaseConfig {

    public static createConnections(connectionsConfigArray: TCreateConnectionConfigArray): IDatabaseConfig['connections'] {
        const result: IDatabaseConfig['connections'] = {};

        for(const connectionConfig of connectionsConfigArray) {
            const { name, config } = connectionConfig
            result[name] = config
        }

        return result
    }

    public static createConfig(adapter: ICtor<IDatabaseAdapter>, options: Omit<IDatabaseGenericConnectionConfig, 'driver'>): IDatabaseGenericConnectionConfig {
        return {
            ...options,
            driver: DatabaseAdapter.getName(adapter)
        }
    }
    
}

export default DatabaseConfig