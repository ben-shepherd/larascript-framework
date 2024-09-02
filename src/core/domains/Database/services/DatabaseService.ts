import DatabaseConfig from "@src/core/domains/database/config/DatabaseConfig";
import InvalidDatabaseConnection from "@src/core/domains/database/exceptions/InvalidDatabaseConnection";
import InvalidDatabaseDriver from "@src/core/domains/database/exceptions/InvalidDatabaseDriver";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseProvider, IDatabaseProviderCtor } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseService } from "@src/core/domains/database/interfaces/IDatabaseService";

class DatabaseService implements IDatabaseService {
    /**
     * Database config
     */
    protected config!: IDatabaseConfig;

    /**
     * Stores all database providers, keyed by connection name
     */
    protected store: Record<string, IDatabaseProvider> = {};

    /**
     * @param config 
     */
    constructor(config: IDatabaseConfig) {
        this.config = config;
    }

    /**
     * Adds all connections to the store
     * Connects databases
     */
    public async boot()
    {
        Object.keys(this.config.connections).forEach((connectionName) => {
            const connectionConfig = this.config.connections[connectionName];
            const providerCtor = this.getDriverCtorByName(connectionConfig.driver);
            const provider = new providerCtor(connectionConfig);

            this.store[connectionName] = provider;
        })

        await this.connectDefault();
        await this.connectKeepAlive();
     }

    /*
     * Connects to the default connection 
     */
    protected async connectDefault() 
    {
        if (this.store[this.config.defaultConnectionName]) {
            await this.store[this.config.defaultConnectionName].connect();
        }
    }

    /**
     * Connects to all keep alive connections
     */
    protected async connectKeepAlive() 
    {
        const connections = (this.config?.keepAliveConnections ?? '').split(',');

        for (const connectionName of connections) {
            if (this.store[connectionName]) {
                await this.store[connectionName].connect();
            }
        }
    }

    /**
     * Get the query service
     * 
     * @param connectionName 
     * @returns 
     */
    public query<T>(connectionName: string = this.config.defaultConnectionName): T 
    {
        return this.store[connectionName].query() as T;
    }

    /**
     * Get the schema service
     * 
     * @param connectionName 
     * @returns 
     */
    public schema<T>(connectionName: string = this.config.defaultConnectionName): T 
    {
        return this.store[connectionName].schema() as T;
    }

    /**
     * Get the database raw client
     * Example
     *  getClient() // MongoClient
     * 
     * @returns 
     */
    public getClient<T = unknown>(connectionName: string = this.config.defaultConnectionName): T
    {
        return this.store[connectionName].getClient();
    }


    /**
     * Check the driver of a specified connection
     * 
     * @param driver 
     * @param connectionName 
     * @returns 
     */
    isProvider(driver: string, connectionName: string = this.config.defaultConnectionName): boolean 
    {
        try {
            const driverCtor = this.getDriverCtorByName(driver);
            return this.store[connectionName] instanceof driverCtor;
        }
        catch (e) {
            if (e instanceof InvalidDatabaseDriver === false) {
                throw e
            }
        }
        return false
    }

    /**
     * Get the driver
     * 
     * @param connectionName 
     * @returns 
     */
    public provider<T>(connectionName: string = this.config.defaultConnectionName): T 
    {
        if (!this.store[connectionName]) {
            throw new InvalidDatabaseConnection(`Invalid database connection: ${connectionName}`);
        }

        return this.store[connectionName] as T;
    }

    /**
     * Get the driver constructor by name
     * 
     * @param driverName 
     * @returns 
     */
    protected getDriverCtorByName(driverName: keyof typeof DatabaseConfig.providers): IDatabaseProviderCtor 
    {
        const driverCtor: IDatabaseProviderCtor | undefined = DatabaseConfig.constructors[driverName];

        if (!driverCtor) {
            throw new InvalidDatabaseDriver(`Invalid database driver: ${driverName}`);
        }

        return driverCtor;
    }
}

export default DatabaseService;