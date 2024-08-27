import { Db, MongoClient } from 'mongodb';

import Service from '@src/core/base/Service';
import { IMongoDB } from '@src/core/domains/database/exceptions/mongodb/IMongoDB';
import IMongoDbConfig from '@src/core/domains/database/exceptions/mongodb/IMongoDbConfig';
import MongoDBConnection from '@src/core/domains/database/services/mongodb/MongoDBConnection';
import { IConnections } from '../../exceptions/IConnections';
import InvalidDatabaseConnection from '../../exceptions/InvalidDatabaseConnection';

/**
 * MongoDB service
 */
export default class MongoDB extends Service<IMongoDbConfig> implements IMongoDB {
    /**
     * Default connection
     */
    private __connnection: string = 'default';
    /**
     * Connection store
     */
    private connections: IConnections = {} as IConnections;

    constructor(config: IMongoDbConfig | null) {
        super(config);
        
        if(config) {
            this.__connnection = config.connection;
        }
    }

    /**
     * Init
     * Define MongoDBConnection instances for every connection available
     */
    public init(): void {
        if(Object.keys(this.connections).length) {
            throw new Error('MongoDB has already been initialised')
        }

        const config = this.getConfig();

        console.log('MongoDB connections:', config);

        for (const conn of Object.keys(config?.connections ?? {})) {
            if (!config?.connections[conn]) {
                continue;
            }

            if(!config?.connections[conn]?.uri) {
                throw new InvalidDatabaseConnection('MongoDB URI is empty or not present');
            }

            this.connections[conn] = new MongoDBConnection(config.connections[conn]);
        }
    }

    /**
    * Attempt connection on the default connection
    */
    public async connectDefaultConnection(): Promise<void> {
        if (this.connections[this.__connnection] instanceof MongoClient === false) {
            await this.connect(this.__connnection);
        }
    }

    /**
     * Attempt connections on specified keep-alive connections
     */
    public async connectKeepAlive(): Promise<void> {
        const connections = (this.config?.keepAliveConnections ?? '').split(',');

        for (const con of connections) {
            if(!con.length) continue;
            await this.connect(con)
        }
    }

    /**
     * Returns the MongoDBConnection for the specified connection
     * @param connectionName Connection name
     * @returns string
     */
    public getConnection(connectionName: string = this.__connnection): MongoDBConnection {
        if (this.connections[connectionName] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }
        return this.connections[connectionName];
    }

    /**
     *  Connection handler
     */
    public async connect(connectionName: keyof IConnections = this.__connnection): Promise<void> {
        if (this.connections[connectionName] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }
        await this.getConnection(connectionName as string).connect();
    }

    /**
     * Get the MongoClient instance of the specified connection
     * @param connectionName 
     * @returns 
     */
    public getClient(connectionName: keyof IConnections = this.__connnection): MongoClient {
        if (this.connections[connectionName] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }
        return this.getConnection(connectionName as string)?.getClient();
    }

    /**
     * Get the Db instance of the specified connection
     * @param connectionName 
     * @returns 
     */
    public getDb(connectionName: string = this.__connnection): Db {
        if (this.connections[connectionName] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }
        return this.getConnection(connectionName).getDb();
    }
}