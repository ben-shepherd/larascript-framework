import { IDatabaseProviderCtor } from "@src/core/domains/database/interfaces/IDatabaseProvider";


interface Config {
    providers: Record<string, string>;
    constructors: Record<string, IDatabaseProviderCtor>;
    packages: Record<string, string>;
}

/**
 * Todo: This should be removed/refactored
 * Needs to be more dynamic to use adapter pattern
 */
const DatabaseConfig: Config = {

    /**
     * Database Provider Constants
     * Important: Value must match the related docker-compose.{value}.yml file, if applicable
     */
    providers: {
        mongodb: 'mongodb',
        postgres: 'postgres',
    },

    /**
     * Database Driver Constructors
     * key: value
     * value: constructor
     * 
     * Example: 
     *   mongodb: new (config: any) => IDatabaseProvider
     * 
     * Usage
     *   Used for instantiating new database driver instances
     */
    constructors: {
        // mongodb: MongoDB,
        // postgres: Postgres
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