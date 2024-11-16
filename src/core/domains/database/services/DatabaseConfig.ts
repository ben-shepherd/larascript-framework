

import { ICtor } from "@src/core/interfaces/ICtor";

import { IDatabaseAdapter } from "../interfaces/IDatabaseAdapter";
import { IDatabaseGenericConnectionConfig } from "../interfaces/IDatabaseConfig";
import DatabaseAdapter from "./DatabaseAdapter";

class DatabaseConfig {

    public static createConfig(adapter: ICtor<IDatabaseAdapter>, options: Omit<IDatabaseGenericConnectionConfig, 'driver'>): IDatabaseGenericConnectionConfig {
        return {
            ...options,
            driver: DatabaseAdapter.getName(adapter)
        }
    }
    
}

export default DatabaseConfig