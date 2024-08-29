import MongoDB from "@src/core/domains/database/drivers/MongoDB";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseDriver, IDatabaseDriverCtor } from "@src/core/domains/database/interfaces/IDatabaseDriver";
import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { IDatabaseService } from "@src/core/domains/database/interfaces/IDatabaseService";
import { TDatabaseDriver } from "@src/core/domains/database/types/DatabaseDriver.t";

class DatabaseService implements IDatabaseService
{
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
    constructor(config: IDatabaseConfig)
    {
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

    /**
     * Get the query service
     * 
     * @param connectionName 
     * @returns 
     */
    public query(connectionName: string = this.config.defaultConnectionName): IDatabaseQuery
    {
        return this.store[connectionName].query();
    }

    /*
     * Connects to the default connection 
     */
    protected async connectDefault()
    {
        if(this.store[this.config.defaultConnectionName]) {
            await this.store[this.config.defaultConnectionName].connect();
        }
    }

    /**
     * Connects to all keep alive connections
     */
    protected async connectKeepAlive()
    { 
        const connections = (this.config?.keepAliveConnections ?? '').split(',');

        for(const connectionName of connections) {
            if(this.store[connectionName]) {
                await this.store[connectionName].connect();
            }
        }
    }

    /**
     * Get the driver
     * 
     * @param connectionName 
     * @returns 
     */
    public driver(connectionName: string = this.config.defaultConnectionName): IDatabaseDriver
    {
        if(!this.store[connectionName]) {
            throw new Error(`Invalid database connection: ${connectionName}`);
        }

        return this.store[connectionName];
    }

    /**
     * Get the driver constructor by name
     * 
     * @param driverName 
     * @returns 
     */
    protected getDriverCtorByName(driverName: TDatabaseDriver): IDatabaseDriverCtor
    {
        if(driverName === 'mongodb') {
            return MongoDB;
        }

        throw new Error(`Invalid database driver: ${driverName}`);
    }
}

export default DatabaseService;