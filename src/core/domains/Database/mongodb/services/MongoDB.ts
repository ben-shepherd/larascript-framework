import { Db, MongoClient } from 'mongodb';

import Singleton from '../../../../base/Singleton';
import IMongoDbConfig from '../../../../interfaces/IMongoDbConfig';
import InvalidDatabaseConnection from '../exceptions/InvalidDatabaseConnection';
import MongoDBConnection from './MongoDBConnection';

interface Connections {
    [key: string]: MongoDBConnection
}

export default class MongoDB extends Singleton<IMongoDbConfig> {
    private __connnection: string = 'default';
    private connections: Connections = {} as Connections;

    constructor(config: IMongoDbConfig) {
        super(config);
        this.__connnection = config.connection;
        this.init();
    }

    public init(): void {
        const config = this.getConfig();

        for (const conn of Object.keys(config?.connections ?? {})) {
            if (!config?.connections[conn]) {
                continue;
            }
            this.connections[conn] = new MongoDBConnection(config.connections[conn]);
        }
    }

    public getConnection(con: string = this.__connnection): MongoDBConnection {
        if (this.connections[con] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${con}`);
        }
        return this.connections[con];
    }

    public async connectDefaultConnection(): Promise<void> {
        if (this.connections[this.__connnection] instanceof MongoClient === false) {
            await this.connect(this.__connnection);
        }
    }

    public async connectKeepAlive(): Promise<void> {
        if (!this.config?.keepAliveConnections) {
            return;
        }
        for (const con of Object.keys(this.config.keepAliveConnections)) {
            await this.connect(con)
        }
    }

    public async connect(con: keyof Connections = this.__connnection): Promise<void> {
        if (this.connections[con] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${con}`);
        }
        await this.getConnection(con as string).connect();
    }

    public getClient(con: keyof Connections = this.__connnection): MongoClient {
        if (this.connections[con] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${con}`);
        }
        return this.getConnection(con as string)?.getClient();
    }

    public getDb(con: string = this.__connnection): Db {
        if (this.connections[con] instanceof MongoDBConnection === false) {
            throw new InvalidDatabaseConnection(`Invalid Database Connection: ${con}`);
        }
        return this.getConnection(con).getDb();
    }
}