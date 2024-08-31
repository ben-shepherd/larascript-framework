import MongoDB from "../drivers/MongoDB";
import { IDatabaseDriverCtor } from "../interfaces/IDatabaseDriver";

interface Config {
    drivers: Record<string, string>;
    constructors: Record<string, IDatabaseDriverCtor>;
    packages: Record<string, string>;
}

const DatabaseConfig: Config = {
    /**
     * Database Driver Constants
     * Important: Value must match the related docker-compose.{value}.yml file
     */
    drivers: {
        mongodb: 'mongodb',
        postgres: 'postgres',
    },
    /**
     * Database Driver Constructors
     * key: value
     * value: constructor
     * 
     * Example: 
     *    mongodb: new (config: any) => IDatabaseDriver
     */
    constructors: {
        mongodb: MongoDB
    },
    /**
     * Database Package Constants
     * Important: The value must equal the name of the package that can be installed with `yarn add {value}`
     * 
     * --- CURRENTLY UNUSED ---
     * -  Removed packages are causing issues because the app cannot import them when they are missing
     */
    packages: {
        mongodb: 'mongodb',
        postgres: 'pg',
    }

} as const;

export default DatabaseConfig