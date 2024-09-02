import DatabaseConfig from "@src/core/domains/database/config/DatabaseConfig";
import InvalidDatabaseConnection from "@src/core/domains/database/exceptions/InvalidDatabaseConnection";
import InvalidDatabaseDriver from "@src/core/domains/database/exceptions/InvalidDatabaseDriver";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseDriver, IDatabaseDriverCtor } from "@src/core/domains/database/interfaces/IDatabaseDriver";
import { IDatabaseService } from "@src/core/domains/database/interfaces/IDatabaseService";

class DatabaseService implements IDatabaseService {
    /**
     * Database config
     */
    protected config!: IDatabaseConfig;

    /**
     * Stores all database connections
     */
    protected store: Record<string, IDatabaseDriver> = {};

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
            const driverCtor = this.getDriverCtorByName(connectionConfig.driver);
            const driver = new driverCtor(connectionConfig);

            this.store[connectionName] = driver;
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
    isDriver(driver: string, connectionName: string = this.config.defaultConnectionName): boolean 
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
    public driver<T>(connectionName: string = this.config.defaultConnectionName): T 
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
    protected getDriverCtorByName(driverName: keyof typeof DatabaseConfig.drivers): IDatabaseDriverCtor 
    {
        const driverCtor: IDatabaseDriverCtor | undefined = DatabaseConfig.constructors[driverName];

        if (!driverCtor) {
            throw new InvalidDatabaseDriver(`Invalid database driver: ${driverName}`);
        }

        return driverCtor;
    }
}

export default DatabaseService;