import { Db, MongoClient } from 'mongodb';

import Service from '@src/core/base/Service';
import { IMongoDB } from '@src/core/domains/database/exceptions/mongodb/IMongoDB';

import MongoDBConnection from '@src/core/domains/database/services/mongodb/MongoDBConnection';
import { IConnections } from '../../exceptions/IConnections';
import InvalidDatabaseConnection from '../../exceptions/InvalidDatabaseConnection';
import { IDatabaseConfigConnection } from '../../interfaces/IDatabaseConfig';

/**
 * MongoDB service
 */
export default class MongoDB extends Service implements IMongoDB {
    
    private defaultConnectionName!: string;
    private connectionConfigs: IDatabaseConfigConnection;

    /**
     * Connection store
     */
    private store: IConnections = {} as IConnections;

    constructor(defaultConnectionName: string, connectionConfigs: IDatabaseConfigConnection) {
        super();
        this.defaultConnectionName = defaultConnectionName;
        this.connectionConfigs = connectionConfigs;
    }

    /**
     * Init
     * Define MongoDBConnection instances for every connection available
     */
    public init(): void {
        if(Object.keys(this.store).length) {
            throw new Error('MongoDB has already been initialised')
        }

        console.log('MongoDB connections:', this.connectionConfigs);

        for (const connectionName of Object.keys(this.connectionConfigs)) {
            const connectionConfig = this.connectionConfigs[connectionName];
            const uri = connectionConfig?.uri ?? '';
            const options = connectionConfig?.options ?? {};

            if(!uri?.length) {
                throw new InvalidDatabaseConnection('MongoDB URI is empty or not present');
            }

            this.store[connectionName] = new MongoDBConnection({ uri, options });
        }
    }

    /**
    * Attempt connection on the default connection
    */
    public async connectDefaultConnection(): Promise<void> {  
        const connectionName = this.defaultConnectionName;

        if(this.connectionConfigs[connectionName] === undefined) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }

        if (this.store[connectionName] instanceof MongoClient === false) {
            await this.connect(connectionName);
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
    public getConnection(connectionName: string = this.defaultConnectionName): MongoDBConnection {
        if (this.store[connectionName] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }
        return this.store[connectionName];
    }

    /**
     *  Connection handler
     */
    public async connect(connectionName: keyof IConnections = this.defaultConnectionName): Promise<void> {
        if (this.store[connectionName] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }
        await this.getConnection(connectionName as string).connect();
    }

    /**
     * Get the MongoClient instance of the specified connection
     * @param connectionName 
     * @returns 
     */
    public getClient(connectionName: keyof IConnections = this.defaultConnectionName): MongoClient {
        if (this.store[connectionName] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }
        return this.getConnection(connectionName as string)?.getClient();
    }

    /**
     * Get the Db instance of the specified connection
     * @param connectionName 
     * @returns 
     */
    public getDb(connectionName: string = this.defaultConnectionName): Db {
        if (this.store[connectionName] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${connectionName}`);
        }
        return this.getConnection(connectionName).getDb();
    }
}