import MongoDB from "@src/core/domains/database/drivers/MongoDB";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseDriver, IDatabaseDriverCtor } from "@src/core/domains/database/interfaces/IDatabaseDriver";
import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { IDatabaseService } from "@src/core/domains/database/interfaces/IDatabaseService";
import { TDatabaseDriver } from "@src/core/domains/database/types/DatabaseDriver.t";

class DatabaseService implements IDatabaseService
{
    protected config!: IDatabaseConfig;

    protected store: Record<string, IDatabaseDriver> = {};

    constructor(config: IDatabaseConfig)
    {
        this.config = config;
    }

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

    public query(connectionName: string = this.config.defaultConnectionName): IDatabaseQuery
    {
        return this.store[connectionName].query();
    }

    protected async connectDefault()
    {
        if(this.store[this.config.defaultConnectionName]) {
            await this.store[this.config.defaultConnectionName].connect();
        }
    }

    protected async connectKeepAlive()
    { 
        const connections = (this.config?.keepAliveConnections ?? '').split(',');

        for(const connectionName of connections) {
            if(this.store[connectionName]) {
                await this.store[connectionName].connect();
            }
        }
    }

    public driver(connectionName: string = this.config.defaultConnectionName): IDatabaseDriver
    {
        if(!this.store[connectionName]) {
            throw new Error(`Invalid database connection: ${connectionName}`);
        }

        return this.store[connectionName];
    }

    protected getDriverCtorByName(driverName: TDatabaseDriver): IDatabaseDriverCtor
    {
        if(driverName === 'mongodb') {
            return MongoDB;
        }

        throw new Error(`Invalid database driver: ${driverName}`);
    }
}

export default DatabaseService;